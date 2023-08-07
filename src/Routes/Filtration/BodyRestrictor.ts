import { Request, NextFunction, response } from "express";
import { RequestBlogData } from "../../Repos/Entities/Blog";
import { RequestPostData } from "../../Repos/Entities/Post";

type bodyData = {
    [key: string] : any;
}

export const RestrictBodyToBlog =
    (request: Request<{}, {}, bodyData, {}>, reponse: Response, next: NextFunction) => {
        let blogProperties = Object.getOwnPropertyNames(new RequestBlogData());
        let buffObj : any;

        blogProperties.forEach(propName =>{
            let bodyValue = request.body[propName];
            if(bodyValue){
                buffObj[propName] = bodyValue;
            }
            else{
                response.sendStatus(400);
                return;
            }
        })
        request.body = buffObj;
        next();
    }

    export const RestrictBodyToPost =
    (request: Request<{}, {}, bodyData, {}>, reponse: Response, next: NextFunction) => {
        let blogProperties = Object.getOwnPropertyNames(new RequestPostData());
        let buffObj : any;

        blogProperties.forEach(propName =>{
            let bodyValue = request.body[propName];
            if(bodyValue){
                buffObj[propName] = bodyValue;
            }
            else{
                response.sendStatus(400);
                return;
            }
        })
        request.body = buffObj;
        next();
    }