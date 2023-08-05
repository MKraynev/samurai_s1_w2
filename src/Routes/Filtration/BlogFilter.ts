import { Request, NextFunction } from "express";
import { Blog } from "../../Repos/Entities/Blog";
import { Post } from "../../Repos/Entities/Post";

type bodyData = {
    [key: string] : any;
}

export const RestrictBodyToBlog =
    (request: Request<{}, {}, bodyData, {}>, reponse: Response, next: NextFunction) => {
        let blogProperties = Object.getOwnPropertyNames(new Blog());
        let buffObj : any;

        blogProperties.forEach(propName => buffObj[propName] = request.body[propName]);
        request.body = buffObj;
    }

    export const RestrictBodyToPost =
    (request: Request<{}, {}, bodyData, {}>, reponse: Response, next: NextFunction) => {
        let blogProperties = Object.getOwnPropertyNames(new Post());
        let buffObj : any;

        blogProperties.forEach(propName => buffObj[propName] = request.body[propName]);
        request.body = buffObj;
    }