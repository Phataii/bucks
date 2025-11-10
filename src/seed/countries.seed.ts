// seed/countries.seed.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import Country from "../models/country.model";

dotenv.config(); // loads MONGO_URI from .env

const countries = [
  {
    name: "Nigeria",
    cca2: "NG",
    cca3: "NGA",
    ccn3: "566",
    cioc: "NGR",
    postalCodeRegex: "\\A\\d{6}\\Z",
    subdivisions: [
      { name: "Abia", code: "AB" },
      { name: "Adamawa", code: "AD" },
      { name: "Akwa Ibom", code: "AK" },
      { name: "Anambra", code: "AN" },
      { name: "Bauchi", code: "BA" },
      { name: "Benue", code: "BE" },
      { name: "Borno", code: "BO" },
      { name: "Bayelsa", code: "BY" },
      { name: "Cross River", code: "CR" },
      { name: "Delta", code: "DE" },
      { name: "Ebonyi", code: "EB" },
      { name: "Edo", code: "ED" },
      { name: "Ekiti", code: "EK" },
      { name: "Enugu", code: "EN" },
      { name: "Abuja Capital Territory", code: "FC" },
      { name: "Gombe", code: "GO" },
      { name: "Imo", code: "IM" },
      { name: "Jigawa", code: "JI" },
      { name: "Kaduna", code: "KD" },
      { name: "Kebbi", code: "KE" },
      { name: "Kano", code: "KN" },
      { name: "Kogi", code: "KO" },
      { name: "Katsina", code: "KT" },
      { name: "Kwara", code: "KW" },
      { name: "Lagos", code: "LA" },
      { name: "Nassarawa", code: "NA" },
      { name: "Niger", code: "NI" },
      { name: "Ogun", code: "OG" },
      { name: "Ondo", code: "ON" },
      { name: "Osun", code: "OS" },
      { name: "Oyo", code: "OY" },
      { name: "Plateau", code: "PL" },
      { name: "Rivers", code: "RI" },
      { name: "Sokoto", code: "SO" },
      { name: "Taraba", code: "TA" },
      { name: "Yobe", code: "YO" },
      { name: "Zamfara", code: "ZA" },
    ],
  },
  {
    name: "United States",
    cca2: "US",
    cca3: "USA",
    ccn3: "840",
    cioc: "USA",
    postalCodeRegex: "\\A(\\d{5})(?:[ \\-](\\d{4}))?\\Z",
    subdivisions: [
      { name: "Alaska", code: "AK" },
      { name: "Alabama", code: "AL" },
      { name: "Arkansas", code: "AR" },
      { name: "Arizona", code: "AZ" },
      { name: "California", code: "CA" },
      { name: "Colorado", code: "CO" },
      { name: "Connecticut", code: "CT" },
      { name: "Delaware", code: "DE" },
      { name: "Florida", code: "FL" },
      { name: "Georgia", code: "GA" },
      { name: "Hawaii", code: "HI" },
      { name: "Illinois", code: "IL" },
      { name: "Indiana", code: "IN" },
      { name: "Iowa", code: "IA" },
      { name: "Kansas", code: "KS" },
      { name: "Kentucky", code: "KY" },
      { name: "Louisiana", code: "LA" },
      { name: "Maine", code: "ME" },
      { name: "Maryland", code: "MD" },
      { name: "Massachusetts", code: "MA" },
      { name: "Michigan", code: "MI" },
      { name: "Minnesota", code: "MN" },
      { name: "Mississippi", code: "MS" },
      { name: "Missouri", code: "MO" },
      { name: "Montana", code: "MT" },
      { name: "Nebraska", code: "NE" },
      { name: "Nevada", code: "NV" },
      { name: "New Hampshire", code: "NH" },
      { name: "New Jersey", code: "NJ" },
      { name: "New Mexico", code: "NM" },
      { name: "New York", code: "NY" },
      { name: "North Carolina", code: "NC" },
      { name: "North Dakota", code: "ND" },
      { name: "Ohio", code: "OH" },
      { name: "Oklahoma", code: "OK" },
      { name: "Oregon", code: "OR" },
      { name: "Pennsylvania", code: "PA" },
      { name: "Rhode Island", code: "RI" },
      { name: "South Carolina", code: "SC" },
      { name: "South Dakota", code: "SD" },
      { name: "Tennessee", code: "TN" },
      { name: "Texas", code: "TX" },
      { name: "Utah", code: "UT" },
      { name: "Vermont", code: "VT" },
      { name: "Virginia", code: "VA" },
      { name: "Washington", code: "WA" },
      { name: "West Virginia", code: "WV" },
      { name: "Wisconsin", code: "WI" },
      { name: "Wyoming", code: "WY" },
    ],
  },
];

async function seedCountries() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error("❌ MONGO_URI not found.");

    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    const existing = await Country.countDocuments();
    if (existing > 0) {
      console.log("🌍 Countries already exist, skipping seed.");
    } else {
      await Country.insertMany(countries);
      console.log("✅ Countries seeded successfully!");
    }

    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seedCountries();
