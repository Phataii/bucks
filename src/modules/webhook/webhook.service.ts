
import Account from "../../models/account.model";
import Transaction from "../../models/transactions.model";
import { NotFoundException } from "../../utils/service-exceptions";

export class WebhookService {

    async handleGraphWebhook(event: any) {

        if (!event || !event.event_type) {
            throw new NotFoundException("Invalid webhook payload");
        }
        switch (event.event_type) {
            case "account.created":
            return handleAccountCreated(event.data);

            case "account.credit":
            return handleAccountCredit(event.data);

            default:
            console.log("⚠️ Unhandled Graph event:", event.event_type);
        }

    }

}

    async function handleAccountCreated(data: any) {
        const {
            id,
            holder_id,
            account_name,
            account_number,
            bank_name,
            bank_code,
            currency,
            balance,
            credit_pending,
            debit_pending,
            status,
        } = data;

        const updated = await Account.findOneAndUpdate(
            { "accounts.accountId": id },
            {
            $set: {
                "accounts.$.accountName": account_name,
                "accounts.$.accountNumber": account_number,
                "accounts.$.bankName": bank_name,
                "accounts.$.bankCode": bank_code,
                currency,
                balance,
                creditPending: credit_pending,
                debitPending: debit_pending,
                status
            }
            },
            { new: true }
        );

        if (!updated) {
            await Account.findOneAndUpdate(
            { personId: holder_id },
            {
                $push: {
                accounts: {
                    accountId: id,
                    accountName: account_name,
                    accountNumber: account_number,
                    bankName: bank_name,
                    bankCode: bank_code,
                    currency,
                    balance,
                    creditPending: credit_pending,
                    debitPending: debit_pending,
                    status,
                }
                }
            },
            { upsert: true, new: true }
            );
        }

        console.log("✅ Account created/updated:", id);
    }

    async function handleAccountCredit(data: any) {
        const {
            id: externalId,
            amount,
            account_id,
            currency,
            description,
            kind,
            status,
            type,
            deposit,
        } = data;

        const { amount_settled, fee, payer } = deposit || {};

        const existingTransaction = await Transaction.findOne({ externalId });
        if (existingTransaction) {
            console.log("🔁 Duplicate credit ignored:", externalId);
            return;
        }

        const internal = await Account.findOne({
            "accounts.accountId": account_id,
        }).select("userId accounts.$");

        if (!internal) {
            console.log("⚠️ Internal account not found");
            return;
        }

        const userId = internal.userId;

        await Transaction.create({
            externalId,
            amount,
            amountSettled: amount_settled,
            accountId: internal._id,
            bankAccountId: account_id,
            currency,
            description,
            fee,
            kind,
            payerName: payer?.name,
            payerBankName: payer?.bank_name,
            type,
            status,
        });

       await Account.updateOne(
            { "accounts.accountId": account_id },
            { $inc: { "accounts.$.balance": amount_settled } }
        );


        console.log(`💰 User ${userId} credited with ${amount_settled}`);
    }