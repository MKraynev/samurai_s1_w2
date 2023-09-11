import { Router, Response, Request } from "express"
import { dataManager } from "../../2_BusinessLogicLayer/_Classes/DataManager";
import { CheckFormatErrors, UserAvailableForConfirmation, UserLoginAndEmailFree, ValidAuthFields, ValidEmail, ValidUserFields } from "../../_legacy/Routes/Validation/RequestCheck";
import { RequestWithBody } from "../_Types/RequestTypes";
import { AuthRequest } from "../_Classes/Data/AuthRequest";
import { UserRequest } from "../_Classes/Data/UserForRequest";
import { emailSender } from "../_Classes/Email/EmailSender";
import { UserResponse } from "../../2_BusinessLogicLayer/_Classes/Data/UserForResponse";
import { RequestParser } from "../_Classes/RequestManagment/RequestParser";
import { Token } from "../../2_BusinessLogicLayer/_Classes/Data/Token";


export const authRouter = Router();
export const confirmAdress = "https://samurai-s1-w2.vercel.app/auth/registration-confirmation";

authRouter.post("/login",
    ValidAuthFields,
    CheckFormatErrors,
    async (request: RequestWithBody<AuthRequest>, response: Response) => {

        let user = await dataManager.userService.CheckUserLogs(request.body.loginOrEmail, request.body.password)

        if (user) {
            let userToken = await dataManager.userService.GenerateToken(user);
            response.status(200).send(userToken);
            return;
        }

        response.sendStatus(401)
    })

authRouter.get("/me", async (request: Request, response: Response) => {
    let token: Token | null = RequestParser.ReadToken(request);

    if (token) {
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
    }

    response.sendStatus(401);
})

authRouter.post("/registration",
    ValidUserFields,
    UserLoginAndEmailFree,
    CheckFormatErrors,
    async (request: any, response: Response) => {

        let reqObj: UserRequest = request.user;

        let savedUser = await dataManager.userService.SaveUser(reqObj);
        if (savedUser) {
            emailSender.SendRegistrationMail(savedUser.email, confirmAdress, savedUser.emailConfirmId);
            response.sendStatus(204);
            return;
        }

        response.sendStatus(401);
    })

///hometask_07/api/auth/registration-email-resending
authRouter.post("/registration-email-resending",
    ValidEmail,
    CheckFormatErrors,
    async (request: RequestWithBody<{ email: string }>, response: Response) => {
        let user = await dataManager.userService.GetUserByMail(request.body.email);
        if(user && user.emailConfirmed == false){
            emailSender.SendRegistrationMail(user.email, confirmAdress, user.emailConfirmId);
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