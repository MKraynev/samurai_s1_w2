import { Request, Response, NextFunction, response } from "express";
import { Blog } from "../../Repos/Blogs/BlogRepo";
import { basicAothorizer } from "../../Authorization/BasicAuthorization/BasicAuthorization";
import { AuthorizationStatus } from "../../Authorization/IAuthorizer";
import { header, body, validationResult } from "express-validator"
import { ErrorLog } from "../../Errors/Error";


export const RequestContainsBlog = (
    request: Request<{}, {}, {}, {}>, reponse: Response, next: NextFunction) => {
    let errors = new ErrorLog();
    let reqData = request.body;

    let blogObjProperties = Object.getOwnPropertyNames(new Blog()).sort().toString();
    let reqObjProperties = Object.getOwnPropertyNames(reqData).sort().toString();

    if (blogObjProperties === reqObjProperties) {
        next();
    }
    else {
        //TODO Выдает ошибку 500 при установке сразу через send
        errors.add("Request", "Request doesn't contain Blog fields")
        response.status(400).send(errors);
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
        let error = new ErrorLog();
        switch (authorizator.RequestIsAuthorized(request)) {
            case AuthorizationStatus.AccessAllowed:
                next();
                break;

            case AuthorizationStatus.DataIsMissing:
                error.add("Request", "Missing authorization data")
                response.status(401).send(error);
                break;

            case AuthorizationStatus.WrongLoginPassword:
                error.add("Request", "Wrong authorization data")
                response.sendStatus(401);
                break;
        }

    }

const FieldNotEmpty = (fieldName: string) => body(fieldName).notEmpty().withMessage(`Empty field: ${fieldName}`);
const FieldIsUri = (fieldName: string) => body(fieldName).isURL().withMessage(`Wrong URL value: ${fieldName}`);
const FieldMinLength = (fieldName: string, minLength: number) => body(fieldName).trim().isLength({ min: minLength}).withMessage(`Wrong length, too short ${minLength}: ${fieldName}`)
const FieldMaxLength = (fieldName: string, maxLength: number) => body(fieldName).trim().isLength({ max: maxLength}).withMessage(`Wrong length, too long ${maxLength}: ${fieldName}`)

export const ValidBlogFields = [
    FieldNotEmpty("name"), FieldMinLength("name", 5), FieldMaxLength("name", 30),
    FieldNotEmpty("description"), FieldMinLength("description", 5),
    FieldNotEmpty("websiteUrl"), FieldIsUri("websiteUrl"), FieldMinLength("description", 5)
];

export const CheckFormatErrors =
    (request: Request<{}, {}, {}, {}>, response: Response, next: NextFunction) => {
        let errorResult = validationResult(request);
        if (!errorResult.isEmpty()) {
            let errors = new ErrorLog();
            let errsByExpressValidator = errorResult.array({ onlyFirstError: true })

            errsByExpressValidator.forEach(errVal => {
                let allMessage: string = errVal.msg;
                let field = allMessage.split(": ")[1];
                let message = allMessage.split(": ")[0];

                errors.add(field, message)
            })
            response.status(400).send(errors);
        }
        next()
    }