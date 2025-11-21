import User from "../../models/user.model";
import Logger from "../../utils/logger";
import { BadRequestException, NotFoundException } from "../../utils/service-exceptions";
import GraphIntegration from "../graph-integration/graph";
import {  personDTO } from "../graph-integration/interfaces/graph.interface";
import Account from "../../models/account.model";
import bcrypt from "bcryptjs";
import { changePin } from "./interfaces/wallet.types";
import mongoose from "mongoose";
import Country from "../../models/country.model";
import Transaction from "../../models/transactions.model";



export default class WalletService {
    private logger = new Logger('users-service');
    private graphApi: GraphIntegration;

    constructor() {
         this.graphApi = new GraphIntegration();
    }
    
    // request a naira account 
    requestAccount = async (userId: string, payload: personDTO) => {
        const user = await User.findOne({ _id: userId }).lean();

        if(!user) throw new NotFoundException("User not found");
        
        let personId;
        if(!user.personId){
            // create person on graph
            const new_person = await this.graphApi.createPerson({
                firstName: user.firstName,
                lastName: user.lastName,
                otherName: user.otherName,
                phone: user.phone,
                email: user.email,
                dob: user.dob,
                idLevel: "primary",
                countryId: user.address.country,
                idType: payload.idType,
                idNumber: payload.idNumber,
                bankIdNumber: payload.bvn,
                kycLevel: "basic",
                address: {
                    address: user.address.address,
                    city: user.address.city,
                    state: user.address.state,
                    country: user.address.country,
                    postal_code: user.address.postalCode
                },
                // TODO: adding these info should create a USD account and upgrade tier
                // background_information: {
                //     employment_status: user.graphMetadata?.employmentStatus,
                //     occupation: user.graphMetadata?.occupation,
                //     primary_purpose: user.graphMetadata?.primaryPurpose,
                //     source_of_funds: user.graphMetadata?.sourceOfFunds,
                //     expected_monthly_inflow: user.graphMetadata?.expectedMonthlyInflow
                // },
            });
            personId = new_person.data.data.id;
            await User.updateOne(
                { _id: user._id },
                { $set: { personId } }
            );
        }
        else{
            personId = user.personId;
        }

        const account = await this.graphApi.requestAccount({
            personId,
            label: `${user.firstName}'s ${payload.currency} account`,
            currency: payload.currency,
        });

        await Account.findOneAndUpdate(
        { userId, provider: "graph" },
            {
                $setOnInsert: {
                userId,
                personId,
                provider: "graph",
                },
                $push: {
                accounts: {
                    accountId: account.data.data.id,
                    accountName: `${user.firstName}'s ${payload.currency} account`,
                    accountNumber: "",
                    bankName: "",
                    bankCode: "",
                    currency: payload.currency,
                    balance: 0,
                    creditPending: 0,
                    debitPending: 0,
                    status: "inactive",
                },
            },
        },
        { upsert: true, new: true }
        );

        
        return {
            message: `A ${payload.currency} account has been created for you.`
        }
    }

    async createTransactionPin(userId: string, pin: string) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const user = await User.findById(userId).session(session);
            if (!user) throw new NotFoundException("User not found");

            const account = await Account.findOne({ userId }).session(session);
            if (!account) throw new BadRequestException("Account not found");

            if (account.pin) {
                throw new BadRequestException("PIN already set. Change pin in the app instead.");
            }

            const hashedPin = await bcrypt.hash(pin, 10);
            account.pin = hashedPin;
            await account.save({ session });

            await session.commitTransaction();
            session.endSession();

            return { message: "PIN set successfully" };
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            throw err;
        }
    }
    
    async changeTransactionPin(userId: string, payload: { oldPin: string; newPin: string; confirmPin: string }) {
        if (payload.newPin !== payload.confirmPin)
        throw new BadRequestException("PIN mismatch");

        const account = await Account.findOne({ userId });
        if (!account) throw new BadRequestException("Account not found");

        const isPinValid = await bcrypt.compare(payload.oldPin, account.pin);
        if (!isPinValid) throw new BadRequestException("Incorrect old PIN");

        const hashedPin = await bcrypt.hash(payload.newPin, 10);
        account.pin = hashedPin;
        await account.save();

        return { message: "PIN updated successfully" };
    }
    
    getAccountDetails = async (userId: string, currencyId: string) => {
        const user = await User.findOne({ _id: userId });
        if(!user) {
            throw new NotFoundException("user not found");
        }
        
        const account =  Account.findOne({ userId, "accounts.currency": currencyId  }, { 
            accounts: { $elemMatch: { currency: currencyId } }
        }).lean();
        if(!account){
        throw new NotFoundException("no account found for user");
        }
        return account
    }

    getActiveCurrencies = async () => {
        const currencies = await Country.find({ isActive: true }).select("currency flag").lean();
        return currencies;
    }


    // webhook
   async handleGraphWebhook(event: any) {
        if (!event || !event.event_type) {
            throw new NotFoundException("Invalid webhook payload");
        }

        console.log("📩 Graph Webhook Event Received:", event.event_type);

        switch (event.event_type) {

            /* =====================================================
            *  ACCOUNT CREATED
            * ===================================================== */
            case "account.created": {
                const data = event.data;

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

                // Update if the account already exists
                const accountDoc = await Account.findOneAndUpdate(
                    { "accounts.accountId": id },
                    {
                        $set: {
                            "accounts.$.accountName": account_name,
                            "accounts.$.accountNumber": account_number,
                            "accounts.$.bankName": bank_name,
                            "accounts.$.bankCode": bank_code,
                            "accounts.$.currency": currency,
                            "accounts.$.balance": balance,
                            "accounts.$.creditPending": credit_pending,
                            "accounts.$.debitPending": debit_pending,
                            "accounts.$.status": status,
                        },
                    },
                    { new: true }
                );

                if (!accountDoc) {
                    // Account not found → Add a new one
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
                                },
                            },
                        },
                        { upsert: true, new: true }
                    );
                }

                console.log(`✅ Account ${id} (${account_name}) synced.`);
                return;
            }

            /* =====================================================
            *  ACCOUNT CREDIT (DEPOSIT)
            * ===================================================== */
            case "account.credit": {
                const data = event.data;

                // Extract main transaction fields
                const {
                    id: externalId,
                    amount,
                    account_id,
                    currency,
                    description,
                    kind,
                    status,
                    type,
                } = data;

                // Extract deposit details (nested)
                const deposit = data.deposit || {};
                const {
                    amount_settled,
                    fee,
                    payer
                } = deposit;

                const payer_name = payer?.name || null;
                const payer_bank_name = payer?.bank_name || null;

                // 1. Prevent duplicate transactions
                const existing = await Transaction.findOne({ externalId }).lean();
                if (existing) {
                    console.log("🔁 Duplicate transaction ignored:", externalId);
                    return;
                }

                // 2. Map deposit → internal account via accounts[]
                const internalAccount = await Account.findOne({
                    "accounts.accountId": account_id,
                }).select("_id accounts").lean();

                const internalAccountId = internalAccount?._id || null;

                // 3. Save transaction
                await Transaction.create({
                    externalId,
                    amount,
                    amountSettled: amount_settled,
                    accountId: internalAccountId,
                    bankAccountId: account_id,
                    currency,
                    description,
                    fee,
                    kind,
                    payerName: payer_name,
                    payerBankName: payer_bank_name,
                    type,
                    status,
                });

                console.log("💰 Deposit transaction saved:", externalId);
                return;
            }

            /* =====================================================
            *  DEFAULT HANDLER
            * ===================================================== */
            default:
                console.log(`⚠️ Unhandled Graph event type: ${event.event_type}`);
                return null;
        }
    }


}