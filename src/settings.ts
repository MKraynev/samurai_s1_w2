import dotenv from "dotenv"
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET_TOKEN || "123321"
export const MONGO_URL = process.env.MONGO_URL || "";
export const MAIL_LOGIN = process.env.GMAIL_LOGIN || "";
export const MAIL_PASSWORD = process.env.GMAIL_PASSWORD || "";
