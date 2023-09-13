import { Router, Response, Request } from "express"
import { dataManager } from "../../../../Common/Data/DataManager/DataManager";
import { CheckFormatErrors, RequestJwtAuthorized, ValidEmail } from "../../../../Common/Request/RequestValidation/RequestValidation";
import { RequestWithBody } from "../../../../Common/Request/Entities/RequestTypes";
import { AuthRequest } from "../Entities/AuthRequest";
import { UserRequest } from "../../Admin/Entities/UserForRequest";
import { emailSender } from "../../../../EmailHandler/EmailSender";
import { UserResponse } from "../../Admin/Entities/UserForResponse";
import { Token } from "../Entities/Token";
import { CONFIRM_ADRESS } from "../../../../settings";
import { ValidUserFields } from "../../Admin/Router/Middleware/UserMiddleware";
import { EmailAvailableForConfirm, UserAvailableForConfirmation, UserLoginAndEmailFreeByUserInBody, ValidAuthFields } from "./Middleware/AuthMeddleware";



export const authRouter = Router();

authRouter.post("/login",
    ValidAuthFields,
    CheckFormatErrors,
    async (request: RequestWithBody<AuthRequest>, response: Response) => {

        let user = await dataManager.userService.CheckUserLogs(request.body.loginOrEmail, request.body.password)

        if (user) {
            let [accessToken, refreshToken] = await dataManager.userService.GenerateTokens(user);
            
            response.cookie("refreshToken", refreshToken.accessToken, { httpOnly: true, secure: true, })
            response.status(200).send(accessToken);
            return;
        }

        response.sendStatus(401)
    })

authRouter.get("/me",
    RequestJwtAuthorized,
    async (request: any, response: Response) => {
        let token: Token = request.token;
        let user = await dataManager.userService.GetUserByToken(token);

        if (user) {
            response.status(200).send(
                {
                    email: user.email,
                    login: user.login,
                    userId: user.id
                })
            return;
        }

        response.sendStatus(401);
    })

authRouter.post("/refresh-token",
    RequestJwtAuthorized,
    async (request: any, response: Response) => {
        let token: Token = request.token;

        let newTokens = await dataManager.userService.RefreshTokens(token);

        if (!newTokens) {
            response.sendStatus(401);
            return;
        }

        let [accessToken, refreshToken] = newTokens;

        response.cookie("refreshToken", refreshToken.accessToken, { httpOnly: true, secure: true, })
        response.status(200).send(accessToken);
    })

authRouter.post("/registration",
    ValidUserFields,
    UserLoginAndEmailFreeByUserInBody,
    CheckFormatErrors,
    async (request: any, response: Response) => {

        let reqObj: UserRequest = request.user;

        let savedUser = await dataManager.userService.SaveUser(reqObj);
        if (savedUser) {
            emailSender.SendRegistrationMail(savedUser.email, CONFIRM_ADRESS, savedUser.emailConfirmId);
            response.sendStatus(204);
            return;
        }

        response.sendStatus(401);
    })

authRouter.post("/registration-email-resending",
    ValidEmail,
    EmailAvailableForConfirm,
    CheckFormatErrors,
    async (request: any, response: Response) => {
        let user = request.user as UserResponse;

        let newLinkVal = await dataManager.userService.UpdateUserEmailConfirmId(user.id);
        if (newLinkVal) {
            emailSender.SendRegistrationMail(user.email, CONFIRM_ADRESS, newLinkVal);
            response.sendStatus(204);
            return;
        }

        response.sendStatus(400);
    })

authRouter.post("/registration-confirmation",
    UserAvailableForConfirmation,
    CheckFormatErrors,
    async (request: any, response: Response) => {

        let foundUser: UserResponse = request.user;
        let confirmedUser = await dataManager.userService.ConfirmUser(foundUser);
        if (confirmedUser) {
            response.sendStatus(204);
            return;
        }
        response.sendStatus(400);

    })

authRouter.post("/logout",
    RequestJwtAuthorized,
    async (request: any, response: Response) => {
        let token: Token = request.token;
        let newTokens = await dataManager.userService.RefreshTokens(token);

        if(newTokens){
            response.sendStatus(204);
            return;
        }
        response.sendStatus(401);
     })