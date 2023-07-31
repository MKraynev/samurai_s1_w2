import { Request, Response, NextFunction, response } from "express";
import { Blog } from "../../../Repos/Blogs/BlogRepo";
import { basicAothorizer } from "../../../Authorization/BasicAuthorization/BasicAuthorization";
import { AuthorizationStatus } from "../../../Authorization/IAuthorizer";



export const RequestContainsBlog = (
    request: Request<{}, {}, {}, {}>, reponse: Response, next: NextFunction) => {

    let reqData = request.body;

    let blogObjProperties = Object.getOwnPropertyNames(new Blog()).sort().toString();
    let reqObjProperties = Object.getOwnPropertyNames(reqData).sort().toString();

    if (blogObjProperties === reqObjProperties) {
        next();
    }
    else {
        //TODO Выдает ошибку 500 при установке сразу через send
        response.sendStatus(400);
        return;
    }
}

export const RequestContainsId = (
    request: Request<{ id: string }, {}, {}, {}>, reponse: Response, next: NextFunction) => {
    let requestedId: string = request.params.id;
    if (undefined || requestedId.trim() === "") {
        response.sendStatus(404);
    }
    next();
}

export const RequestAuthorized =
    (request: Request<{}, {}, {}, {}>, reponse: Response, next: NextFunction) => {
        let authorizator = basicAothorizer;

        switch (authorizator.RequestIsAuthorized(request)) {
            case AuthorizationStatus.AccessAllowed:
                next();
                break;

            case AuthorizationStatus.DataIsMissing:
                response.sendStatus(401);
                break;

            case AuthorizationStatus.WrongLoginPassword:
                response.sendStatus(401);
                break;
        }

    }


