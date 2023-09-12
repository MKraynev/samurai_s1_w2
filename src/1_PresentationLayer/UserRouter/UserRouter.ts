import { Router, Request, Response } from "express"
import { RequestParser } from "../_Classes/RequestManagment/RequestParser";
import { dataManager } from "../../2_BusinessLogicLayer/_Classes/DataManager";
import { CheckFormatErrors, RequestBaseAuthorized, ValidUserFields } from "../../_legacy/Routes/Validation/RequestCheck";
import { CompleteRequest, RequestWithBody, RequestWithParams } from "../_Types/RequestTypes";
import { UserRequest } from "../_Classes/Data/UserForRequest";
import { UserResponceLite } from "../../2_BusinessLogicLayer/_Classes/Data/UserForResponse";

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


        let reqObj = new UserRequest(request.body.login, request.body.password, request.body.email);
        
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

        // let userIsDeleted = await dataManager.userRepo.DeleteCertain(idVal);
        let userIsDeleted = await dataManager.userService.DeleteUser(idVal);

        if (userIsDeleted) response.sendStatus(204);

        else response.sendStatus(404);
        return;
    }

)