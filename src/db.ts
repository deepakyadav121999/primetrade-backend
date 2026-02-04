import mongoose from "mongoose";
import { config } from "./config";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error", err);
    process.exit(1);
  }
};
