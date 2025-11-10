import { model, Schema, Types, Document } from "mongoose";

type Status = "active" | "inactive" | "suspended";

export interface IBankAccounts {
  accountId: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
  currency: string;
  balance: number;
  creditPending: number;
  debitPending: number;
  status: Status;
}

export interface IAccount extends Document {
  userId: Types.ObjectId;
  personId?: string;
  provider?: string;
  accounts: IBankAccounts[];
  createdAt: Date;
  updatedAt: Date;
}

const accountDetailsSchema = new Schema<IBankAccounts>({
  accountId: { type: String, required: true },
  accountName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  bankName: { type: String, required: true },
  bankCode: { type: String, required: true },
  currency: { type: String, required: true },
  balance: { type: Number, default: 0 },
  creditPending: { type: Number, default: 0 },
  debitPending: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["active", "inactive", "suspended"],
    default: "inactive",
  },
});

const accountSchema = new Schema<IAccount>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    personId: { type: String },
    provider: { type: String },
    accounts: { type: [accountDetailsSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

const Account = model<IAccount>("Account", accountSchema);

export default Account;
