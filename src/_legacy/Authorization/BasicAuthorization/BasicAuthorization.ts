
import { AuthorizationStatus } from "../IAuthorizer";

export const ValidBase64Key = (encodedKeyValue : string|undefined): AuthorizationStatus => {
    
    if((!!encodedKeyValue) && encodedKeyValue.startsWith("Basic ")){
        let expectedKeyVal = Encode64("admin:qwerty");
        let keyFromRequest = encodedKeyValue.slice(6);
        if(keyFromRequest !== expectedKeyVal){
            return AuthorizationStatus.WrongLoginPassword;
        }
        return AuthorizationStatus.AccessAllowed;
    }
    return AuthorizationStatus.DataIsMissing;
}

export const Decode64 = (str: string): string => Buffer.from(str, 'base64').toString('binary');
export const Encode64 = (str: string): string => Buffer.from(str, 'binary').toString('base64');