import mongoose, { Schema, Document, model } from "mongoose";

export interface ISubdivision {
  name: string;
  code: string;
}

export interface ICountryDocument extends Document {
  name: string;
  cca2: string;
  cca3: string;
  ccn3: string;
  cioc?: string;
  postalCodeRegex?: string;
  currency?: string;
  currencySymbol?: string;
  flag?: string;
  timezone?: string;
  isActive: boolean;
  conversionFee: number;
  subdivisions: ISubdivision[];
}

const subdivisionSchema = new Schema<ISubdivision>({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, trim: true, uppercase: true },
});

const countrySchema = new Schema<ICountryDocument>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    cca2: {
      type: String,
      required: true,
      uppercase: true,
      minlength: 2,
      maxlength: 2,
      match: /^[A-Z]{2}$/,
    },
    cca3: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      minlength: 3,
      maxlength: 3,
      match: /^[A-Z]{3}$/,
    },
    ccn3: { type: String, required: true },
    cioc: { type: String },
    postalCodeRegex: { type: String },
    currency: { type: String, uppercase: true, minlength: 3, maxlength: 3 },
    currencySymbol: { type: String },
    flag: { type: String },
    timezone: { type: String },
    isActive: { type: Boolean, default: true },
    conversionFee: { type: Number, default: 1.0, min: 0, max: 10 },
    subdivisions: { type: [subdivisionSchema], default: [] },
  },
  { timestamps: true }
);

// ✅ Only keep necessary indexes
countrySchema.index({ cca3: 1, isActive: 1 });
countrySchema.index({ isActive: 1 });

const Country = model<ICountryDocument>("Country", countrySchema);
export default Country;
