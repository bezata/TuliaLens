import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: parseInt(process.env.PORT || "3000", 10),
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgresql://username:password@localhost:5432/tulialens?schema=public",
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
  NODE_ENV: process.env.NODE_ENV || "development",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
};