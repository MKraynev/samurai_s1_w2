import { Router, Response, Request } from "express"
import { dataManager } from "../../2_BusinessLogicLayer/_Classes/DataManager";
import { CheckFormatErrors, UserAvailableForConfirmation, ValidAuthFields, ValidUserFields } from "../../_legacy/Routes/Validation/RequestCheck";
import { RequestWithBody, RequestWithQuery } from "../_Types/RequestTypes";
import { AuthRequest } from "../_Classes/Data/AuthRequest";
import { RequestParser } from "../_Classes/RequestManagment/RequestParser";
import { Token } from "../../2_BusinessLogicLayer/_Classes/Data/Token";
import { UserRequest } from "../_Classes/Data/UserForRequest";
import { emailSender } from "../_Classes/Email/EmailSender";
import { LoginEmailStatus } from "../../2_BusinessLogicLayer/_Classes/UserService";

export const authRouter = Router();

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

// authRouter.get("", async (request: Request, response: Response) => {
//     let token: Token | null = RequestParser.ReadToken(request);

//     if (token) {
//         let user = await dataManager.userService.GetUserByToken(token);

//         if (user) {
//             response.status(200).send(
//                 {
//                     email: user.email,
//                     login: user.login,
//                     userId: user.id
//                 })
//             return;
//         }
//     }

//     response.sendStatus(401);
// })

authRouter.post("/registration",
    ValidUserFields,
    CheckFormatErrors,
    async (request: RequestWithBody<UserRequest>, response: Response) => {

        let reqObj = new UserRequest(request.body.login, request.body.password, request.body.email);
        let existStatus = await dataManager.userService.CurrentLoginOrEmailExist(reqObj.login, reqObj.email);

        switch (existStatus) {
            case LoginEmailStatus.EmailEXist:
            case LoginEmailStatus.LoginExist:
                response.sendStatus(401);
                return;

            case LoginEmailStatus.LoginAndEmailFree:
                let savedUser = await dataManager.userService.SaveUser(reqObj);
                if (savedUser) {
                    emailSender.SendRegistrationMail(savedUser.email, "http://localhost:5001/auth", savedUser.emailConfirmId);
                    response.sendStatus(204);
                    return;
                }
        }
        response.sendStatus(401);
    })

authRouter.get("/registration-confirmation",
    UserAvailableForConfirmation,
    CheckFormatErrors,
    async (request: any, response: Response) => {

        let foundUser = request.user;
        let confirmedUser = await dataManager.userService.ConfirmUser(foundUser);
        
        response.sendStatus(204);
    })