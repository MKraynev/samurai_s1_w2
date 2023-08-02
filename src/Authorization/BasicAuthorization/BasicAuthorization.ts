import { Request } from "express";
import { AuthorizationStatus, IAuthorizer } from "../IAuthorizer";


const KEY: string = "admin:qwerty";

class BasicAutorizer implements IAuthorizer {
    private _KEY: string;

    RequestIsAuthorized(req: Request<{}, {}, {}, {}>): AuthorizationStatus {
        let headerVal = req.header("authorization");
        
        //Scenario_1
        //Логин/Пароль отутствует
        if ((!headerVal) ||
            (headerVal.indexOf("Basic ") !== 0)) {
            return AuthorizationStatus.DataIsMissing;
        }

        //Scenario_2
        //Неправильный логин/пароль
        let encodeKey = this.Encode(this._KEY);
        if(headerVal.slice(6) !== encodeKey){
            return AuthorizationStatus.WrongLoginPassword;
        }

        //Scenario_3
        //Верный логин/пароль
        return AuthorizationStatus.AccessAllowed;
    }


    constructor(key: string = "admin:qwerty") {
        this._KEY = key;
    }

    public Decode = (str: string): string => Buffer.from(str, 'base64').toString('binary');
    public Encode = (str: string): string => Buffer.from(str, 'binary').toString('base64');

}

export const basicAothorizer = new BasicAutorizer(KEY);