import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

interface AppConfig {
  port: number;
  mongoUri: string;
  jwtSecret: string;
  jwtExpiresIn: string | number;
}

export const config: AppConfig = {
  port: PORT,
  mongoUri:
    process.env.MONGO_URI ??
    "mongodb://localhost:27017/primetrade_auth_dashboard",
  jwtSecret: process.env.JWT_SECRET ?? "dev-secret-change-in-prod",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
};
