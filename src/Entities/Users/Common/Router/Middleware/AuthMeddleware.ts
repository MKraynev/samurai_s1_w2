import { NextFunction, Request, Response } from "express";
import { UserResponse } from "../../../Admin/Entities/UserForResponse";
// import { dataManager } from "../../../../../Common/DataManager/DataManager";
import { ErrorLog } from "../../../../../Common/Request/RequestValidation/Error";
import { UserRequest } from "../../../Admin/Entities/UserForRequest";
import { LoginEmailStatus } from "../../BuisnessLogic/UserService";
import { body, oneOf } from "express-validator";
import { FieldMaxLength, FieldMinLength, FieldNotEmpty } from "../../../../../Common/Request/RequestValidation/RequestValidation";

// export const UserAvailableForConfirmation = async (request: any, response: Response, next: NextFunction) => {
//     let code = request.query.code ? request.query.code : request.body.code;

//     let user: UserResponse | null = await dataManager.userService.GetUserByConfirmEmailCode(code);


//     if (!user || user.emailConfirmed) {
//         let error = new ErrorLog();
//         error.add("code", "Wrong code value")
//         response.status(400).send(error);
//         return;
//     }
//     request.user = user;
//     next();
// }
// export const UserLoginAndEmailFreeByUserInBody = async (request: any, response: Response, next: NextFunction) => {
//     let reqUser = new UserRequest(request.body.login, request.body.password, request.body.email);
//     let existStatus = await dataManager.userService.CurrentLoginOrEmailExist(reqUser.login, reqUser.email);
//     let error = new ErrorLog();

//     switch (existStatus) {
//         case LoginEmailStatus.LoginExist:
//             error.add("login", "Such login already exist")
//             break;
//         case LoginEmailStatus.EmailEXist:
//             error.add("email", "Such email already exist")
//             break;

//         case LoginEmailStatus.LoginAndEmailFree:
//             request.user = reqUser;
//             next();
//             return;
//             break;
//     }
//     response.status(400).send(error);
//     return;
// }

// export const EmailAvailableForConfirm = async (request: any, response: Response, next: NextFunction) => {
//     let user = await dataManager.userService.GetUserByMail(request.body.email);
//     if (user && user.emailConfirmed == false) {
//         request.user = user;
//         next();
//         return;
//     }
//     let error = new ErrorLog();
//     error.add("email", "Wrong email value");

//     response.status(400).send(error);
//     return;
// }

export const ValidAuthFields = [
    oneOf(
        [
            FieldNotEmpty("loginOrEmail"), FieldMinLength("loginOrEmail", 3), FieldMaxLength("loginOrEmail", 10),
            FieldNotEmpty("loginOrEmail"), body("loginOrEmail").isEmail().withMessage("Wrong email: email")
        ]),
    FieldNotEmpty("password"), FieldMinLength("password", 6), FieldMaxLength("password", 20),
];