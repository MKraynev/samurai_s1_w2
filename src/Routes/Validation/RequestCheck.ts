import { Request, Response, NextFunction, response } from "express";
import { basicAothorizer } from "../../Authorization/BasicAuthorization/BasicAuthorization";
import { AuthorizationStatus } from "../../Authorization/IAuthorizer";
import { header, body, validationResult } from "express-validator"
import { ErrorLog, ErrorMessage} from "../../Errors/Error";



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

const FieldNotEmpty = (fieldName: string) => body(fieldName).trim().notEmpty().withMessage(`Empty field: ${fieldName}`);
const FieldIsUri = (fieldName: string) => body(fieldName).isURL().withMessage(`Wrong URL value: ${fieldName}`);
const FieldMinLength = (fieldName: string, minLength: number) => body(fieldName).trim().isLength({ min: minLength}).withMessage(`Wrong length, too short ${minLength}: ${fieldName}`)
const FieldMaxLength = (fieldName: string, maxLength: number) => body(fieldName).trim().isLength({ max: maxLength}).withMessage(`Wrong length, too long ${maxLength}: ${fieldName}`)

export const ValidBlogFields = [
    FieldNotEmpty("name"), FieldMinLength("name", 5), FieldMaxLength("name", 15),
    FieldNotEmpty("description"), FieldMinLength("description", 3),
    FieldNotEmpty("websiteUrl"), FieldIsUri("websiteUrl")
];
export const ValidPostFields = [
    FieldNotEmpty("title"), FieldMinLength("title", 5), FieldMaxLength("title", 30),
    FieldNotEmpty("shortDescription"), FieldMinLength("shortDescription", 5), FieldMaxLength("shortDescription", 40),
    FieldNotEmpty("content"), FieldMinLength("content", 5), FieldMaxLength("content", 500),
    FieldNotEmpty("blogId"), FieldMinLength("blogId", 1)
];


export const CheckFormatErrors =
    (request: Request<{}, {}, {}, {}>, response: Response, next: NextFunction) => {
        let errorResult = validationResult(request);
        if (!errorResult.isEmpty()) {
            let errors = new ErrorLog();
            let errsByExpressValidator = errorResult.array()

            errsByExpressValidator.forEach(errVal => {
                let allMessage: string = errVal.msg;
                let field = allMessage.split(": ")[1];
                let message = allMessage.split(": ")[0];
                let errIndex = errors.errorsMessages.findIndex(errMsg => errMsg.field === field);
                if( errIndex === -1){
                    errors.add(field, message);
                }
                
            })
            response.status(400).send(errors);
            return;
        }
        next()
    }