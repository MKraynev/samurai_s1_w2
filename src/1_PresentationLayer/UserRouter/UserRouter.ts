import { Router, Request, Response } from "express"
import { RequestParser } from "../_Classes/RequestManagment/RequestParser";
import { dataManager } from "../../2_BusinessLogicLayer/_Classes/DataManager";
import { CheckFormatErrors, RequestAuthorized, ValidUserFields } from "../../_legacy/Routes/Validation/RequestCheck";
import { CompleteRequest, RequestWithBody, RequestWithParams } from "../_Types/RequestTypes";
import { UserRequest } from "../_Classes/Data/UserForRequest";

export const userRouter = Router();

userRouter.get("", async (request: Request, response: Response) => {

    let searchParams = RequestParser.ReadQueryUserSorter(request);
    let pageHandler = RequestParser.ReadQueryPageHandle(request);

    let foundValues = await dataManager.userRepo.TakeAll(searchParams, pageHandler);
    let returnValues = foundValues || [];

    response.status(200).send(returnValues)
    return;
})

userRouter.post("",
    RequestAuthorized,
    ValidUserFields,
    CheckFormatErrors,
    async (request: RequestWithBody<UserRequest>, response: Response) => {


        let reqObj = new UserRequest(request.body.login, request.body.password, request.body.email);
        //Blog exist
        let savedPost = await dataManager.userRepo.Save(reqObj);
        if (savedPost) {
            response.status(201).send(savedPost);
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
    RequestAuthorized,
    CheckFormatErrors,
    async (request: RequestWithParams<{ id: string }>, response: Response) => {
        let idVal = request.params.id;
        let userExist = await dataManager.userRepo.TakeCertain(idVal);
        
        if (userExist) {
            let userIsDeleted = await dataManager.userRepo.DeleteCertain(idVal);

            if (userIsDeleted) {
                response.sendStatus(204);

            }
            else {
                response.sendStatus(404);
            }
        }
        else{
            response.sendStatus(404);
        }
        return;
    })