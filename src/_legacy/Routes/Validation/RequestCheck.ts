import { Request, Response, NextFunction, response } from "express";
import { ValidBase64Key, } from "../../Authorization/BasicAuthorization/BasicAuthorization";
import { AuthorizationStatus } from "../../Authorization/IAuthorizer";
import { body, validationResult, oneOf, param } from "express-validator"
import { ErrorLog } from "../../Errors/Error";
import { _BlogRepo } from "../../Repos/BlogRepo";
import { dataManager } from "../../../2_BusinessLogicLayer/_Classes/DataManager";
import { Token } from "../../../2_BusinessLogicLayer/_Classes/Data/Token";
import { RequestParser } from "../../../1_PresentationLayer/_Classes/RequestManagment/RequestParser";


export const RequestBaseAuthorized =
    (request: Request<{}, {}, {}, {}>, reponse: Response, next: NextFunction) => {
        let headerValue = request.header("authorization");
        let error = new ErrorLog();
        switch (ValidBase64Key(headerValue)) {
            case AuthorizationStatus.AccessAllowed:
                next();
                return;
                break;

            case AuthorizationStatus.WrongLoginPassword:
            case AuthorizationStatus.DataIsMissing:
                error.add("Request", "Missing authorization data")
                response.status(401).send(error);
                break;
        }

    }
export const RequestJwtAuthorized = async (request: any, reponse: Response, next: NextFunction) => {
    let token: Token | null = RequestParser.ReadToken(request);
    if (token) {
        let user = await dataManager.userService.GetUserByToken(token);
        if (user) {
            request.user = user;
            next();
        }
    }


    let error = new ErrorLog();
    error.add("Request", "Missing authorization data")
    response.status(401).send(error);
}

const FieldNotEmpty = (fieldName: string) => body(fieldName).trim().notEmpty().withMessage(`Empty field: ${fieldName}`);
const FieldIsUri = (fieldName: string) => body(fieldName).isURL().withMessage(`Wrong URL value: ${fieldName}`);
const FieldMinLength = (fieldName: string, minLength: number) => body(fieldName).trim().isLength({ min: minLength }).withMessage(`Wrong length, too short ${minLength}: ${fieldName}`)
const FieldMaxLength = (fieldName: string, maxLength: number) => body(fieldName).trim().isLength({ max: maxLength }).withMessage(`Wrong length, too long ${maxLength}: ${fieldName}`)

export const ValidBlogFields = [
    FieldNotEmpty("name"), FieldMinLength("name", 2), FieldMaxLength("name", 15),
    FieldNotEmpty("description"), FieldMinLength("description", 3),
    FieldNotEmpty("websiteUrl"), FieldIsUri("websiteUrl")
];
export const ValidPostFields = [
    FieldNotEmpty("title"), FieldMinLength("title", 5), FieldMaxLength("title", 30),
    FieldNotEmpty("shortDescription"), FieldMinLength("shortDescription", 5), FieldMaxLength("shortDescription", 100),
    FieldNotEmpty("content"), FieldMinLength("content", 5), FieldMaxLength("content", 1000),
    FieldNotEmpty("blogId"), FieldMinLength("blogId", 24), FieldMaxLength("blogId", 24)
];
export const ValidPostFieldsLight = [
    FieldNotEmpty("title"), FieldMinLength("title", 5), FieldMaxLength("title", 30),
    FieldNotEmpty("shortDescription"), FieldMinLength("shortDescription", 5), FieldMaxLength("shortDescription", 100),
    FieldNotEmpty("content"), FieldMinLength("content", 5), FieldMaxLength("content", 1000)
];

export const ValidUserFields = [
    FieldNotEmpty("login"), FieldMinLength("login", 3), FieldMaxLength("login", 10),
    FieldNotEmpty("password"), FieldMinLength("password", 6), FieldMaxLength("password", 20),
    FieldNotEmpty("email"), body("email").isEmail().withMessage("Wrong email: email")

];
export const ValidAuthFields = [
    oneOf(
        [
            FieldNotEmpty("loginOrEmail"), FieldMinLength("loginOrEmail", 3), FieldMaxLength("loginOrEmail", 10),
            FieldNotEmpty("loginOrEmail"), body("loginOrEmail").isEmail().withMessage("Wrong email: email")
        ]),
    FieldNotEmpty("password"), FieldMinLength("password", 6), FieldMaxLength("password", 20),
];

export const BlogIdExist = body("blogId").custom(async idVal => {
    let requestedData = await dataManager.blogRepo.TakeCertain(idVal);
    if (!requestedData) {
        throw new Error(`Wrong blogId: blogId`)
    }
})
export const PostIdExist = param("id").custom(async idVal => {
    let foundPost = await dataManager.postRepo.TakeCertain(idVal);
    if (!foundPost) {
        let error = new ErrorLog();
        error.add("Request", "Wrong postId")
        response.status(404).send(error);
    }
})
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
                if (errIndex === -1) {
                    errors.add(field, message);
                }

            })
            response.status(400).send(errors);
            return;
        }
        next()
    }
export const ValidContent = [
    FieldNotEmpty("content"),
    FieldMinLength("content", 20),
    FieldMaxLength("content", 300)
]