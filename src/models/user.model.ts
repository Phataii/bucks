import mongoose, { Schema, Document, Types, model } from 'mongoose';

type kycStatus = "pending" | "verified" | "rejected";
type status = "active" | "inactive" | "suspended";
type authProvider = "google" | "microsoft" | "email";

// Address interface
export interface IAddress {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  otherName: string;
  username: string;
  gender: string;
  dob: string;
  email: string;
  password: string;
  phone: string;
  address: IAddress;
  personId: string;  //Gotten from graph
  preferredCurrency: string; // e.g. "NGN", "USD"
  kycLevel: number; // 0=unverified, 1=basic, 2=full
  kycStatus: kycStatus;
  emailVerified: boolean;
  tier: number;
  country: Types.ObjectId;
  twoFaEnabled: boolean;
  authProvider: authProvider,
  bvn?: string;
  idType?: string;
  idNumber?: string;
  dateOfBirth?: Date;
  isBusiness: boolean;
  businessId?: Types.ObjectId;
  status: status;
  referralCode: string;
  referredBy: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  graphMetadata?: {
    employmentStatus?: string;
    occupation?: string;
    primaryPurpose?: string;
    sourceOfFunds?: string;
    expectedMonthlyInflow?: number;
    [key: string]: any;
  };

}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  otherName: { type: String, required: false },
  username: { type: String, required: true },
  gender: { type: String, required: false },
  dob: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, required: true },
  address: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  personId: { type: String, required: false },
  preferredCurrency: { type: String, default: 'NGN' },
  kycLevel: { type: Number },
  kycStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
  emailVerified: { type: Boolean, default: false },
  tier: { type: Number },
  country: { type: Schema.Types.ObjectId, ref: "Country" },
  twoFaEnabled: { type: Boolean, default: false },
  authProvider: {
    type: String,
    enum: ['google', 'apple', 'email'],
    default: 'email'
  },
  bvn: { type: String, required: false },
  idType: { type: String, required: false },
  idNumber: { type: String, required: false },
  dateOfBirth: { type: Date },
  isBusiness: { type: Boolean, default: false },
  businessId: { type: Schema.Types.ObjectId, ref: "Business" },
  status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
  referralCode: { type: String },
  referredBy: { type: String },
  lastLogin: { type: Date},
  graphMetadata: {
      employmentStatus: { type: String, require: false },
      occupation: { type: String, require: false },
      primaryPurpose: { type: String, require: false },
      sourceOfFunds: { type: String, require: false },
      expectedMonthlyInflow: { type: Number, require: false },
    }
}, {
  timestamps: true
});

const User = model<IUser>("User", userSchema);

export default User;