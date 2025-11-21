import mongoose from "mongoose";
import dotenv from "dotenv";
import Banks from "../models/banks.model";

dotenv.config(); // loads MONGO_URI from .env

const banks = [
  { "name": "Access Bank Plc", "code": "044" },
  { "name": "Ecobank Nigeria Plc", "code": "050" },
  { "name": "Fidelity Bank Plc", "code": "070" },
  { "name": "First Bank of Nigeria Ltd", "code": "011" },
  { "name": "First City Monument Bank (FCMB)", "code": "214" },
  { "name": "Guaranty Trust Bank Ltd (GTBank)", "code": "058" },
  { "name": "Heritage Bank Plc", "code": "030" },
  { "name": "Jaiz Bank Plc", "code": "301" },
  { "name": "Keystone Bank Ltd", "code": "082" },
  { "name": "Polaris Bank Ltd", "code": "076" },
  { "name": "Stanbic IBTC Bank Plc", "code": "039" },
  { "name": "Standard Chartered Bank Nigeria", "code": "068" },
  { "name": "Sterling Bank Plc", "code": "232" },
  { "name": "Union Bank of Nigeria Plc", "code": "032" },
  { "name": "United Bank for Africa Plc (UBA)", "code": "033" },
  { "name": "Unity Bank Plc", "code": "215" },
  { "name": "Wema Bank Plc", "code": "035" },
  { "name": "Zenith Bank Plc", "code": "057" },

  /* Newer / Microfinance / Regional / Switching Supported Banks */
  { "name": "Parallex Bank Ltd", "code": "104" },
  { "name": "Premium Trust Bank", "code": "105" },
  { "name": "Signature Bank", "code": "106" },
  { "name": "Globus Bank Ltd", "code": "103" },
  { "name": "Titan Trust Bank", "code": "102" },

  /* Mobile Money Operators (MMO) */
  { "name": "Opay (Paycom)", "code": "305" },
  { "name": "Moniepoint MFB", "code": "50515" },
  { "name": "Kuda MFB", "code": "50211" },
  { "name": "PalmPay", "code": "999992" },
  { "name": "Paga", "code": "327" },
  { "name": "Rubies MFB", "code": "125" },
  { "name": "VFD MFB", "code": "566" },
  { "name": "Hope PSB", "code": "120" },
  { "name": "MTN Momo PSB", "code": "120003" },
  { "name": "9PSB", "code": "120001" },
  { "name": "Smartcash PSB", "code": "120002" }
]


async function seedBanks() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error("❌ MONGO_URI not found.");

    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    const existing = await Banks.countDocuments();
    if (existing > 0) {
      console.log("🌍 Banks already exist, skipping seed.");
    } else {
      await Banks.insertMany(banks);
      console.log("✅ Banks seeded successfully!");
    }

    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}


seedBanks();