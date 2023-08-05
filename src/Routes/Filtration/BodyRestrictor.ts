import { Request, NextFunction, response } from "express";
import { Blog } from "../../Repos/Entities/Blog";
import { Post } from "../../Repos/Entities/Post";

type bodyData = {
    [key: string] : any;
}

export const RestrictBodyToBlog =
    (request: Request<{}, {}, bodyData, {}>, reponse: Response, next: NextFunction) => {
        let blogProperties = Object.getOwnPropertyNames(new Blog());
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
        let blogProperties = Object.getOwnPropertyNames(new Post());
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