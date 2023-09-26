import { Token } from "../../../Entities/Users/Common/Entities/Token";
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "../../../settings";

export enum TokenStatus {
    Invalid,
    Expired,
    Accepted,
    PropertyNotFound
}

type DeviceInfo = {
    id: string;
    name: string;
}
export type TokenLoad = {
    id: string;
    deviceId: number;
}


export class TokenDecodeResult<T> {
    constructor(
        public tokenStatus: TokenStatus,
        public propertyVal?: T) { }
}

export class TokenHandler {
    constructor(private secret: string) { }
    public async DecodePropertyFromToken(token: Token, propertyName: string): Promise<TokenDecodeResult<string>> {
        try {
            let tokenStatus = await this.isTokenExpired(token);

            switch (tokenStatus) {
                case TokenStatus.Accepted:
                    break;
                case TokenStatus.Expired:
                    return new TokenDecodeResult(TokenStatus.Expired);
                case TokenStatus.Invalid:
                default:
                    return new TokenDecodeResult(TokenStatus.Invalid);
                    break;
            }

            let decodeRes: any = await jwt.verify(token.accessToken, this.secret);
            let propertyValue = decodeRes[propertyName] as string;
            let result = propertyValue ?
                new TokenDecodeResult<string>(TokenStatus.Accepted, propertyValue)
                : new TokenDecodeResult<string>(TokenStatus.PropertyNotFound);

            return result;
        }
        catch {
            return new TokenDecodeResult(TokenStatus.Invalid);
        }
    }
    public async isTokenExpired(token: Token): Promise<TokenStatus> {
        try {
            // let decoded = await jwt.decode(token.accessToken) as JwtPayload;
            let decoded = await jwt.verify(token.accessToken, this.secret) as JwtPayload
            if (decoded && decoded.exp) {
                let nowTime: number = Date.now()
                let tokenIsFresh = nowTime <= decoded.exp * 1000;

                let status: TokenStatus = tokenIsFresh ? TokenStatus.Accepted : TokenStatus.Expired;
                return status;
            }
            return TokenStatus.Invalid;
        }
        catch {
            return TokenStatus.Invalid;
        }
    }
    public async GenerateToken(loadData: TokenLoad, timeExpireInSeconds: number): Promise<Token | null> {
        try {
            // let accessTokenVal = await jwt.sign(loadData, this.secret, { expiresIn: timeExpire });
            let accessTokenVal = await jwt.sign({exp: timeExpireInSeconds,  id: loadData.id, deviceId: loadData.deviceId}, this.secret);
            let token: Token = {
                accessToken: accessTokenVal
            }
            
            return token;
        }
        catch {
            return null;
        }
    }
    public async GetTokenLoad(token: Token): Promise<TokenDecodeResult<TokenLoad>> {
        try {
            let tokenStatus = await this.isTokenExpired(token);

            switch (tokenStatus) {
                case TokenStatus.Accepted:
                    break;
                case TokenStatus.Expired:
                    return new TokenDecodeResult(TokenStatus.Expired);
                case TokenStatus.Invalid:
                default:
                    return new TokenDecodeResult(TokenStatus.Invalid);
                    break;
            }

            let decodeRes: any = await jwt.verify(token.accessToken, this.secret);

            let dataFromToken: TokenLoad = {
                id: decodeRes["id"],
                deviceId: decodeRes["deviceId"]
            }

            return new TokenDecodeResult(TokenStatus.Accepted, dataFromToken);;
        }
        catch {
            return new TokenDecodeResult(TokenStatus.Invalid);
        }
    }
}

export const tokenHandler = new TokenHandler(JWT_SECRET);