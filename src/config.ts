import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/primetrade_auth_dashboard",
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-in-prod",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
};
