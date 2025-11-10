import User from "../../models/user.model";
import Logger from "../../utils/logger";
import { NotFoundException } from "../../utils/service-exceptions";
import GraphIntegration from "../graph-integration/graph";
import {  personDTO } from "../graph-integration/interfaces/graph.interface";
import Account, { IAccount } from "../../models/account.model";




export default class WalletService {
    private logger = new Logger('users-service');
    private graphApi: GraphIntegration;

    constructor() {
         this.graphApi = new GraphIntegration();
    }
    
    // Create Graph Account
    createWallet = async (userId: string, payload: personDTO) => {
        const user = await User.findOne({ _id: userId }).lean();

        if(!user) throw new NotFoundException("User not found");
        
        // TODO: IN CASE THE USER ALREADY HAS A PERSON ENTITY
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
                background_information: {
                    employment_status: user.graphMetadata?.employmentStatus,
                    occupation: user.graphMetadata?.occupation,
                    primary_purpose: user.graphMetadata?.primaryPurpose,
                    source_of_funds: user.graphMetadata?.sourceOfFunds,
                    expected_monthly_inflow: user.graphMetadata?.expectedMonthlyInflow
                },
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

        const account =  await this.graphApi.createAccount({
            personId,
            label: `${user.firstName}'s ${payload.currency} account`,
            currency: payload.currency    
        })
        
        const newAccount = await Account.create({
            userId,
            personId,
            provider: "graph",
            accountId: account.data.data.id,
        })
        
        return {
            message: `An ${payload.currency} account has been created for you.`,
            data: newAccount
        }
    }

    getAccount = async () => {
          const account =  await this.graphApi.getPerson()
        return account
    }




    // webhook
    async handleGraphWebhook(event: any) {
        if (!event || !event.event_type) {
            throw new NotFoundException("Invalid webhook payload");
        }

        console.log("📩 Graph Webhook Event Received:", event.event_type);

        switch (event.event_type) {
            case "account.created":
                const data = event.data;

                // Destructure important fields
                const {
                    id,
                    holder_id,
                    label,
                    account_name,
                    account_number,
                    routing_number,
                    bank_name,
                    bank_code,
                    currency,
                    balance,
                    credit_pending,
                    debit_pending,
                    status,
                    created_at,
                    updated_at,
                } = data;

                // Create or update account record
                const account = await Account.findOneAndUpdate(
                    { accountId: id },
                    {
                        personId: holder_id,
                        label,
                        accountName: account_name,
                        accountNumber: account_number,
                        routingNumber: routing_number,
                        bankName: bank_name,
                        bankCode: bank_code,
                        status,
                        currency,
                        balance,
                        creditPending: credit_pending,
                        debitPending: debit_pending,
                        provider: "graph",
                        createdAtGraph: created_at,
                        updatedAtGraph: updated_at,
                    },
                    { upsert: true, new: true }
                );

                console.log(`✅ Account ${id} (${account_name}) recorded successfully.`);
                return account;

            default:
                console.log(`⚠️ Unhandled Graph event type: ${event.event_type}`);
                return null;
        }
    }
}