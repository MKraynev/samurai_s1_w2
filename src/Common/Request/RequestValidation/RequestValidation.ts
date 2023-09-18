import { Request, Response, NextFunction, response } from "express";
import { AuthorizationStatus } from "../../../Entities/Users/Admin/Router/Middleware/IAuthorizer";
import { body, validationResult } from "express-validator"
import { ErrorLog } from "./Error";
// import { dataManager } from "../../DataManager/DataManager";
import { Token } from "../../../Entities/Users/Common/Entities/Token";
import { RequestParser } from "../RequestParser/RequestParser";
import { Base64 } from "../../Authentication/Admin/Base64";
import { ADMIN_PASSWORD } from "../../../settings";

export const RequestBaseAuthorized = (request: Request<{}, {}, {}, {}>, reponse: Response, next: NextFunction) => {
    let headerValue = request.header("authorization");

    if (!headerValue || !Base64.ValidBase64Key(headerValue, ADMIN_PASSWORD)) {
        let error = new ErrorLog();
        error.add("Request", "Missing authorization data")
        response.status(401).send(error);
    }
    next();
    return;

}

// export const RequestJwtAuthorized = async (request: any, response: Response, next: NextFunction) => {
//     let tokenFromBody: Token | null = RequestParser.ReadTokenFromBody(request);
//     let tokenFromCookie: Token | null = RequestParser.ReadTokenFromCookie(request);
//     let token = tokenFromBody || tokenFromCookie;

//     if (!token) {
//         let error = new ErrorLog();
//         error.add("Request", "There is no token")
//         response.status(401).send(error);
//         return;
//     }

//     let tokenExpired = await dataManager.userService.isTokenExpired(token);
//     if (tokenExpired) {
//         let error = new ErrorLog();
//         error.add("Request", "Token expired")
//         response.status(401).send(error);
//         return;
//     }

//     let user = await dataManager.userService.GetUserByToken(token);

//     if (user?.usedRefreshTokens.includes(token.accessToken)) {
//         let error = new ErrorLog();
//         error.add("Request", "Token not available")
//         response.status(401).send(error);
//         return;
//     }

//     if (user) {
//         request.user = user;
//         request.token = token;
//         next();
//         return;
//     }

//     let error = new ErrorLog();
//     error.add("Request", "Missing authorization data")
//     response.status(401).send(error);
//     return;
// }

export const FieldNotEmpty = (fieldName: string) => body(fieldName).trim().notEmpty().withMessage(`Empty field: ${fieldName}`);
export const FieldIsUri = (fieldName: string) => body(fieldName).isURL().withMessage(`Wrong URL value: ${fieldName}`);
export const FieldMinLength = (fieldName: string, minLength: number) => body(fieldName).trim().isLength({ min: minLength }).withMessage(`Wrong length, too short ${minLength}: ${fieldName}`)
export const FieldMaxLength = (fieldName: string, maxLength: number) => body(fieldName).trim().isLength({ max: maxLength }).withMessage(`Wrong length, too long ${maxLength}: ${fieldName}`)


export const ValidEmail = [FieldNotEmpty("email"), body("email").isEmail().withMessage("Wrong email: email")];



export const CheckFormatErrors = (request: Request<{}, {}, {}, {}>, response: Response, next: NextFunction) => {
    let errorResult = validationResult(request);
    if (!errorResult.isEmpty()) {
        let errors = new ErrorLog();
        let errsByExpressValidator = errorResult.array()

        errsByExpressValidator.forEach(errVal => {
            let allMessage: string = errVal.msg;
            let field = allMessage.split(": ")[1];
            let message = allMessage.split(": ")[0];
            let errIndex = errors.errorsMessages.findIndex(errMsg => errMsg.field === field);
            if (errIndex === -1) {
                errors.add(field, message);
            }

        })
        response.status(400).send(errors);
        return;
    }
    next()
}

