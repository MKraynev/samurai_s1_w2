import { Request, Response, NextFunction, response } from "express";
import { body, validationResult } from "express-validator"
import { ErrorLog } from "./Error";
import { Base64 } from "../../Authentication/Admin/Base64";
import { ADMIN_PASSWORD } from "../../../settings";
import { requestLogService } from "../../../RequestLogger/BuisnessLogic/RequestLoggerService";
import { RequestLogRequest } from "../../../RequestLogger/Entities/RequestLogRequest";


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

export const RequestIsAllowed = async (request: Request, response: Response, next: NextFunction) => {
    let ip = FormatRequestIp(request.ip);
    let requestRoot = request.baseUrl + request.path;
    let requestIsAllowed = await requestLogService.RequestIsAllowed(ip, requestRoot);
    
    let reqData = new RequestLogRequest(ip, requestRoot);
    let SaveRequest = await requestLogService.SaveRequest(reqData);
    
    if(requestIsAllowed){
        request.formatedIp = ip;
        
        request.deviceName = request.useragent?.platform || "unknownDevice";
        next();
        return;
    }

    response.sendStatus(429);
}

const FormatRequestIp = (reqIp: string): string => {
    let availableLetters: string[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
    let resultVal = "";

    for(let letterPos = 0; letterPos < reqIp.length; letterPos++){
        if(availableLetters.includes(reqIp[letterPos]))
        resultVal += reqIp[letterPos];
    }
    return resultVal;
}