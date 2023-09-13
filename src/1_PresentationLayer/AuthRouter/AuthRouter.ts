import { Router, Response, Request } from "express"
import { dataManager } from "../../2_BusinessLogicLayer/_Classes/DataManager";
import { CheckFormatErrors, RequestJwtAuthorized, UserAvailableForConfirmation, EmailAvailableForConfirm, UserLoginAndEmailFreeByUserInBody, ValidAuthFields, ValidEmail, ValidUserFields } from "../../_legacy/Routes/Validation/RequestCheck";
import { RequestWithBody } from "../_Types/RequestTypes";
import { AuthRequest } from "../_Classes/Data/AuthRequest";
import { UserRequest } from "../_Classes/Data/UserForRequest";
import { emailSender } from "../_Classes/Email/EmailSender";
import { UserResponse } from "../../2_BusinessLogicLayer/_Classes/Data/UserForResponse";
import { Token } from "../../2_BusinessLogicLayer/_Classes/Data/Token";
import { CONFIRM_ADRESS, TOKEN_COOKIE_NAME } from "../../settings";



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
///hometask_08/api/auth/logout
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