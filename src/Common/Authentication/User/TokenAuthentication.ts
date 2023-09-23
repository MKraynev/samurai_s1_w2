import { Token } from "../../../Entities/Users/Common/Entities/Token";
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "../../../settings";

export enum TokenStatus {
    Invalid,
    Expired,
    Accepted,
    PropertyNotFound
}
export class TokerDecodeResult {
    constructor(
        public tokenStatus: TokenStatus,
        public propertyVal?: string | number | boolean) { }
}

export class TokenHandler {
    constructor(private secret: string) { }
    public async DecodePropertyFromToken(token: Token, propertyName: string): Promise<TokerDecodeResult> {
        try {
            if (await this.isTokenExpired(token) !== TokenStatus.Accepted) {
                return new TokerDecodeResult(TokenStatus.Expired);
            }

            let decodeRes: any = await jwt.verify(token.accessToken, this.secret);
            let propertyValue = decodeRes[propertyName] as string;
            let result = propertyValue? 
            new TokerDecodeResult(TokenStatus.Accepted, propertyValue)
            : new TokerDecodeResult(TokenStatus.PropertyNotFound);

            return result;
        }
        catch {
            return new TokerDecodeResult(TokenStatus.Invalid);
        }
    }
    public async isTokenExpired(token: Token): Promise<TokenStatus> {
        try {
            let decoded = await jwt.decode(token.accessToken) as JwtPayload;
            if (decoded && decoded.exp) {
                let nowTime: number = Date.now()
                let tokenIsFresh = nowTime >= decoded.exp * 1000;

                let status: TokenStatus = tokenIsFresh ? TokenStatus.Accepted : TokenStatus.Expired;
                return status;
            }
            return TokenStatus.Invalid;
        }
        catch {
            return TokenStatus.Invalid;
        }
    }
    public async GenerateToken(obj: any, timeExpire: string): Promise<Token | null> {
        try {
            let accessTokenVal = await jwt.sign(obj, this.secret, { expiresIn: timeExpire });
            let token: Token = {
                accessToken: accessTokenVal
            }
            return token;
        }
        catch {
            return null;
        }
    }
}

export const tokenHandler = new TokenHandler(JWT_SECRET);