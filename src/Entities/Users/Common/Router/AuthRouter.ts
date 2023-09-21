import { Router, Response, Request } from "express"
import { CheckFormatErrors, FieldNotEmpty, ValidEmail } from "../../../../Common/Request/RequestValidation/RequestValidation";
import { RequestWithBody, RequestWithQuery } from "../../../../Common/Request/Entities/RequestTypes";
import { AuthRequest } from "../Entities/AuthRequest";
import { UserRequest } from "../../Admin/Entities/UserForRequest";
import { emailSender } from "../../../../EmailHandler/EmailSender";
import { UserResponse } from "../../Admin/Entities/UserForResponse";
import { Token } from "../Entities/Token";
import { CONFIRM_ADRESS } from "../../../../settings";
import { ValidUserFields } from "../../Admin/Router/Middleware/UserMiddleware";
import { ValidAuthFields } from "./Middleware/AuthMeddleware";
import { UserServiceExecutionResult, userService } from "../BuisnessLogic/UserService";



export const authRouter = Router();

authRouter.post("/login",
    ValidAuthFields,
    CheckFormatErrors,
    async (request: RequestWithBody<AuthRequest>, response: Response) => {
        let authRequest = new AuthRequest(request.body.loginOrEmail, request.body.password);

        let generateTokens = await userService.Login(authRequest);

        switch (generateTokens.executionStatus) {
            case UserServiceExecutionResult.DataBaseFailed:
            case UserServiceExecutionResult.NotFound:
            case UserServiceExecutionResult.ServiceFail:
            case UserServiceExecutionResult.Unauthorized:
            case UserServiceExecutionResult.WrongPassword:
                response.sendStatus(401);
                break;


            case UserServiceExecutionResult.Success:
                response.cookie("refreshToken", generateTokens.executionResultObject!.refreshToken, { httpOnly: true, secure: true, })
                response.status(200).send(generateTokens.executionResultObject!.accessToken);
                break;
        }
        //let user = await dataManager.userService.CheckUserLogs(request.body.loginOrEmail, request.body.password)

        // if (user) {
        //     let [accessToken, refreshToken] = await dataManager.userService.GenerateTokens(user);

        //     
        //     return;
        // }

        // response.sendStatus(401)
    })
//TODO реализовать мидлвер с проверкой наличия токенаЫ
authRouter.get("/me",
    async (request: any, response: Response) => {
        let token: Token = request.token;
        let search = await userService.GetUserByToken(token);

        switch (search.executionStatus) {
            case UserServiceExecutionResult.DataBaseFailed:
            case UserServiceExecutionResult.NotFound:
            case UserServiceExecutionResult.ServiceFail:
            case UserServiceExecutionResult.Unauthorized:
            case UserServiceExecutionResult.WrongPassword:
                response.sendStatus(401);
                break;

            case UserServiceExecutionResult.Success:
                response.status(200).send({
                    email: search.executionResultObject!.email,
                    login: search.executionResultObject!.login,
                    userId: search.executionResultObject!.id
                })
                break;
        }
        // let user = await dataManager.userService.GetUserByToken(token);

        // if (user) {
        //     response.status(200).send(
        //         {
        //             email: user.email,
        //             login: user.login,
        //             userId: user.id
        //         })
        //     return;
        // }

        // response.sendStatus(401);
    })

authRouter.post("/refresh-token",
    async (request: any, response: Response) => {
        let token: Token = request.token;

        let generateNewTokens = await userService.RefreshUserAccess(token);

        switch (generateNewTokens.executionStatus) {
            case UserServiceExecutionResult.DataBaseFailed:
            case UserServiceExecutionResult.NotFound:
            case UserServiceExecutionResult.ServiceFail:
            case UserServiceExecutionResult.Unauthorized:
            case UserServiceExecutionResult.WrongPassword:
                response.sendStatus(401);
                break;

            case UserServiceExecutionResult.Success:
                let accessToken = generateNewTokens.executionResultObject?.accessToken;
                let refreshToken = generateNewTokens.executionResultObject?.accessToken;

                if (accessToken && refreshToken) {
                    response.cookie("refreshToken", refreshToken.accessToken, { httpOnly: true, secure: true, })
                    response.status(200).send(accessToken);
                    return;
                }

                response.status(400).send(accessToken);
                break;
        }

        // let newTokens = await dataManager.userService.RefreshTokens(token);

        // if (!newTokens) {
        //     response.sendStatus(401);
        //     return;
        // }

        // let [accessToken, refreshToken] = newTokens;

        // response.cookie("refreshToken", refreshToken.accessToken, { httpOnly: true, secure: true, })
        // response.status(200).send(accessToken);
    })

authRouter.post("/registration",
    ValidUserFields,
    CheckFormatErrors,
    async (request: RequestWithBody<UserRequest>, response: Response) => {


        let user = new UserRequest(request.body.login, request.body.password, request.body.email);
        let registration = await userService.RegisterUser(user);

        switch (registration.executionStatus) {
            case UserServiceExecutionResult.Success:
                if (!registration.executionResultObject) {
                    response.sendStatus(400);
                    return;
                }

                emailSender.SendRegistrationMail(registration.executionResultObject.email, CONFIRM_ADRESS, registration.executionResultObject.emailConfirmId);
                response.sendStatus(204);
                break;

            case UserServiceExecutionResult.DataBaseFailed:
            case UserServiceExecutionResult.ServiceFail:
            case UserServiceExecutionResult.UserAlreadyExist:
            default:
                response.sendStatus(400);
                break;


        }
        // let savedUser = await dataManager.userService.SaveUser(reqObj);
        // if (savedUser) {
        //     emailSender.SendRegistrationMail(savedUser.email, CONFIRM_ADRESS, savedUser.emailConfirmId);
        //     response.sendStatus(204);
        //     return;
        // }

        // response.sendStatus(401);
    })

authRouter.post("/registration-email-resending",
    ValidEmail,
    CheckFormatErrors,
    async (request: RequestWithBody<{ email: string }>, response: Response) => {
        let getNewConfirmId = await userService.GetConfirmId(request.body.email);

        switch (getNewConfirmId.executionStatus) {
            case UserServiceExecutionResult.Success:
                if (!getNewConfirmId.executionResultObject) {
                    response.sendStatus(400);
                    return;
                }
                emailSender.SendRegistrationMail(getNewConfirmId.executionResultObject.email, CONFIRM_ADRESS, getNewConfirmId.executionResultObject.emailConfirmId);
                response.sendStatus(204);
                break;


            case UserServiceExecutionResult.NotFound:
            case UserServiceExecutionResult.ServiceFail:
            default:
                response.sendStatus(400);
                break;
        }
        // let newLinkVal = await dataManager.userService.UpdateUserEmailConfirmId(user.id);
        // if (newLinkVal) {
        //     emailSender.SendRegistrationMail(user.email, CONFIRM_ADRESS, newLinkVal);
        //     response.sendStatus(204);
        //     return;
        // }

        // response.sendStatus(400);
    })

authRouter.post("/registration-confirmation",
    FieldNotEmpty("code"),
    CheckFormatErrors,
    async (request: RequestWithBody<{ code: string }>, response: Response) => {

        let confirmUser = await userService.ConfirmUser(request.body.code);
        switch (confirmUser.executionStatus) {
            case UserServiceExecutionResult.Success:
                if (confirmUser.executionResultObject) {
                    response.sendStatus(204);
                    return;
                }
                response.sendStatus(400);
                break;

            case UserServiceExecutionResult.NotFound:
            case UserServiceExecutionResult.ServiceFail:
            case UserServiceExecutionResult.DataBaseFailed:
            default:
                response.sendStatus(400);
                break;

        }
        // let foundUser: UserResponse = request.user;
        // let confirmedUser = await dataManager.userService.ConfirmUser(foundUser);
        // if (confirmedUser) {
        //     response.sendStatus(204);
        //     return;
        // }
        // response.sendStatus(400);

    })

authRouter.post("/logout",
    async (request: any, response: Response) => {
        let token: Token = request.token;

        let generateNewTokens = await userService.RefreshUserAccess(token);

        switch (generateNewTokens.executionStatus) {
            case UserServiceExecutionResult.DataBaseFailed:
            case UserServiceExecutionResult.NotFound:
            case UserServiceExecutionResult.ServiceFail:
            case UserServiceExecutionResult.Unauthorized:
            case UserServiceExecutionResult.WrongPassword:
                response.sendStatus(401);
                break;

            case UserServiceExecutionResult.Success:
                let accessToken = generateNewTokens.executionResultObject?.accessToken;
                let refreshToken = generateNewTokens.executionResultObject?.accessToken;

                if (accessToken && refreshToken) {
                    response.cookie("refreshToken", refreshToken.accessToken, { httpOnly: true, secure: true, })
                    response.sendStatus(204);
                    return;
                }

                response.status(400).send(accessToken);
                break;
        }
        // let token: Token = request.token;
        // let newTokens = await dataManager.userService.RefreshTokens(token);

        // if(newTokens){
        //     response.sendStatus(204);
        //     return;
        // }
        // response.sendStatus(401);
     })