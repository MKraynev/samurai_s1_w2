import dotenv from "dotenv"
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET_TOKEN || "123321"
export const MONGO_URL = process.env.MONGO_URL || "";
export const MAIL_LOGIN = process.env.GMAIL_LOGIN || "";
export const MAIL_PASSWORD = process.env.GMAIL_PASSWORD || "";
export const CONFIRM_ADRESS = process.env.USER_CONFIRM_ADRESS || "http://localhost/auth/registration-confirmation";
export const ACCESS_TOKEN_TIME = process.env.ACCESS_TOKEN_EXPIRE || "10s";
export const REFRESH_TOKEN_TIME = process.env.REFRESH_TOKEN_EXPIRE || "20s";
export const TOKEN_COOKIE_NAME = process.env.COOKIE_TOKEN_NAME || "samurai";
export const PORT_NUM: number = +(process.env.PORT_NUMBER || "5001");