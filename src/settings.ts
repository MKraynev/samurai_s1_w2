import dotenv from "dotenv"
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET_TOKEN || "123321"
export const MONGO_URL = process.env.MONGO_URL || "";