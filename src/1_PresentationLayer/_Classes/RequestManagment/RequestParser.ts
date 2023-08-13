import {Request} from "express"

export class RequestParser{
    static ReadQuery<T>(obj: new () => T, request : Request): T {
        //some code
        return new obj();
    }
    
    static ReadBody<T>(obj: new () => T): T {
        //some code
        return new obj();
    }

}