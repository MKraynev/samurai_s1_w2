import { Router, Request, Response } from "express"
import { RequestParser } from "../../../../Common/Request/RequestParser/RequestParser";

import { CheckFormatErrors, RequestBaseAuthorized } from "../../../../Common/Request/RequestValidation/RequestValidation";
import { RequestWithBody, RequestWithParams } from "../../../../Common/Request/Entities/RequestTypes";
import { UserResponceLite } from "../Entities/UserForResponse";
import { dataManager } from "../../../../Common/Data/DataManager/DataManager";
import { UserRequest } from "../Entities/UserForRequest";
import { ValidUserFields } from "./Middleware/UserMiddleware";

export const userRouter = Router();

userRouter.get("", async (request: Request, response: Response) => {

    let searchParams = RequestParser.ReadQueryUserSorter(request);
    let pageHandler = RequestParser.ReadQueryPageHandle(request);

    //let foundValues = await dataManager.userRepo.TakeAll(searchParams, pageHandler);
    let foundValues = await dataManager.userService.GetUsers(searchParams, pageHandler);
    let returnValues = foundValues || [];

    response.status(200).send(returnValues)
    return;
})

userRouter.post("",
    RequestBaseAuthorized,
    ValidUserFields,
    CheckFormatErrors,
    async (request: RequestWithBody<UserRequest>, response: Response) => {


        let reqObj = new UserRequest(request.body.login, request.body.password, request.body.email, true);
        
        let savedPost = await dataManager.userService.SaveUser(reqObj);
        if (savedPost) {
            response.status(201).send(new UserResponceLite(savedPost));
            return;
        }
        response.sendStatus(400);

    })

// userRouter.put("/:id",
// RequestAuthorized,
// CheckFormatErrors,
// async (request: CompleteRequest<{ id: string }, UserRequest, {}>, response: Response) => {
//     let requestedPostId = request.params.id;

//     let requestedUser = await dataManager.userRepo.TakeCertain(requestedPostId);
//     if (requestedUser) {
//         let reqData: UserRequest = new UserRequest(
//             request.body.login, request.body.password, request.body.email)

//         let updateResultIsPositive = await dataManager.userRepo.Update(requestedPostId, reqData);

//         if (updateResultIsPositive) {
//             response.sendStatus(204);
//             return;
//         }
//     }
//     response.sendStatus(404);
// })

userRouter.delete("/:id",
    RequestBaseAuthorized,
    CheckFormatErrors,
    async (request: RequestWithParams<{ id: string }>, response: Response) => {
        let idVal = request.params.id;
        let userIsDeleted = await dataManager.userService.DeleteUser(idVal);

        if (userIsDeleted) response.sendStatus(204);

        else response.sendStatus(404);
        return;
    }

)