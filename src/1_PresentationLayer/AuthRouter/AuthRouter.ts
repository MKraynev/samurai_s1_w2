import {Router, Response} from "express"
import { dataManager } from "../../2_BusinessLogicLayer/_Classes/DataManager";
import { CheckFormatErrors, RequestAuthorized, ValidAuthFields } from "../../_legacy/Routes/Validation/RequestCheck";
import { RequestWithBody } from "../_Types/RequestTypes";
import { AuthRequest } from "../_Classes/Data/AuthRequest";

export const authRouter = Router();

authRouter.post("",
    RequestAuthorized,
    ValidAuthFields,
    CheckFormatErrors,
    async (request: RequestWithBody<AuthRequest>, response: Response) => {
        
        let userExist = await dataManager.userRepo.UserExist(request.body.loginOrEmail, request.body.password)
        
        if(userExist){
            response.sendStatus(204);
        }
        else{
            response.sendStatus(401)
        }
    })