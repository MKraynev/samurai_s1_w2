import { Token } from "../../../Entities/Users/Common/Entities/Token";
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "../../../settings";

export class TokenHandler {
    constructor(private secret: string) {}
    public async DecodePropertyFromToken(token: Token, propertyName: string): Promise<string | undefined> {
        try {
            let decodeRes: any = await jwt.verify(token.accessToken, this.secret);
            return decodeRes[propertyName];
        }
        catch {
            return undefined;
        }
    }
    public async isTokenExpired(token: Token): Promise<boolean> {
        try {
            let decoded = await jwt.decode(token.accessToken) as JwtPayload;
            if (decoded && decoded.exp) {
                let nowTime: number = Date.now()
                let verdict = nowTime >= decoded.exp * 1000;
                
                return verdict;
            }
            return true;
        }
        catch {
            return true;
        }
    }
    public async GenerateToken(obj: any, timeExpire: string): Promise<Token | null>{
        try{
            let accessTokenVal = await jwt.sign(obj, this.secret, { expiresIn: timeExpire });
            let token: Token = {
                accessToken: accessTokenVal
            }
            return token;
        }
        catch{
            return null;
        }
    }
}

export const tokenHandler = new TokenHandler(JWT_SECRET);