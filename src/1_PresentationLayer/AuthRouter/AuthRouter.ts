import { Router, Response, Request } from "express"
import { dataManager } from "../../2_BusinessLogicLayer/_Classes/DataManager";
import { CheckFormatErrors } from "../../_legacy/Routes/Validation/RequestCheck";
import { RequestWithBody } from "../_Types/RequestTypes";
import { AuthRequest } from "../_Classes/Data/AuthRequest";
import { RequestParser } from "../_Classes/RequestManagment/RequestParser";
import { Token } from "../../2_BusinessLogicLayer/_Classes/Data/Token";

export const authRouter = Router();

authRouter.post("/login",
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

authRouter.get("", async (request: Request, response: Response) => {
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