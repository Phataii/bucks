import { Schema, model, Document } from "mongoose";

export interface IAccount extends Document {
  businessId: string;
  personId: string;
  label: string;
  currency: string;
  autoSweep: boolean;
  whitelist: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema = new Schema<IAccount>(
  {
    businessId: { type: String, required: true, unique: true },
    personId: { type: String, required: true },
    label: { type: String, required: true },
    currency: { type: String },
    autoSweep: { type: Boolean, default: false },
    whitelist: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
const Accounts = model<IAccount>("Accounts", AccountSchema);
export default Accounts;
