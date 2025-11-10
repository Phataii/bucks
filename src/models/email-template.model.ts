import { Schema, model, Document } from "mongoose";

export interface IEmailTemplate extends Document {
  name: string;                 // unique key, e.g. "welcome_user"
  subject: string;              // email subject
  body: string;                 // HTML or EJS template
  variables: string[];          // allowed placeholders (e.g., ["name", "amount"])
  language?: string;            // e.g., "en", "fr", "sw"
  category?: string;            // e.g., "transaction", "security", "system"
  createdBy?: string;           // admin who created it
  updatedBy?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EmailTemplateSchema = new Schema<IEmailTemplate>(
  {
    name: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    body: { type: String, required: true }, // Can hold HTML or EJS
    variables: { type: [String], default: [] },
    language: { type: String, default: "en" },
    category: { type: String, default: "general" },
    createdBy: { type: String },
    updatedBy: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
const EmailTemplate = model<IEmailTemplate>("EmailTemplate", EmailTemplateSchema);
export default EmailTemplate;
