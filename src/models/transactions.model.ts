import { model, Schema, Types } from "mongoose";


export interface ITransaction extends Document {
    externalId: string,
    amount: number,
    amountSettled: number,
    accountId: Types.ObjectId,
    bankAccountId: string;
    currency: string,
    description: string,
    fee: number,
    kind: string,
    payerName: string,
    payerBankName: string,
    type: string,
    status: string,
    createdAt: Date;
    updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
    {
        externalId: { type: String },
        amount: { type: Number },
        amountSettled: { type: Number },
        accountId: { type: Schema.Types.ObjectId },
        bankAccountId: { type: String },
        currency: { type: String },
        description: { type: String },
        fee: { type: Number },
        kind: { type: String },
        payerName: { type: String },
        payerBankName: { type: String },
        type: { type: String },
        status: { type: String },
    },
    {
        timestamps: true,
    }
)

const Transaction = model<ITransaction>("Transactions", transactionSchema);

export default Transaction;