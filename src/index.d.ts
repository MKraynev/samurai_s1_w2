import express from "express";
import { Token } from "./Entities/Users/Common/Entities/Token";

declare global {
    namespace Express {
        export interface Request {
            accessToken: Token;
            refreshToken: Token;
        }
    }
}
