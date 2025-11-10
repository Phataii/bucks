// config/db.ts
import mongoose from "mongoose";
import Logger from "../utils/logger";

const logger = new Logger("server");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    logger.log("✅ Database Connected", {});

  } catch (err) {
    logger.error("❌ MongoDB connection error:", { err });
    process.exit(1);
  }
};

export default connectDB;
