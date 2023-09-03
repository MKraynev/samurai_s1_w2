import { Router, Request, Response } from "express";
import { dataManager } from "../../2_BusinessLogicLayer/_Classes/DataManager";
import { RequestWithParams } from "../_Types/RequestTypes";
import { CheckFormatErrors, RequestJwtAuthorized, ValidContent } from "../../_legacy/Routes/Validation/RequestCheck";
import { UserResponse } from "../../2_BusinessLogicLayer/_Classes/Data/UserForResponse";
import { DeleteResult, UpdateResult } from "../../3_DataAccessLayer/Comments/CommentsRepo";
import { CommentRequest } from "../_Classes/Data/CommentRequest";

export const commentRouter = Router();

commentRouter.get("/:id", async (request: RequestWithParams<{ id: string }>, response: Response) => {
    let comment = await dataManager.commentRepo.TakeCertain(request.params.id);
    if (comment) {
        response.send(comment);
        return;
    }
    response.sendStatus(404);
})

commentRouter.delete("/:id",
    RequestJwtAuthorized,
    async (request: any, response: Response) => {
        let user: UserResponse = request.user;
        let deleteResult = await dataManager.commentRepo.DeleteCertainWithUserCheck(request.params.id, user.id);

        switch (deleteResult) {
            case DeleteResult.WrongUser:
                response.sendStatus(403);
                break;
            case DeleteResult.Deleted:
                response.sendStatus(204);
                break;
            default:
                response.sendStatus(404);
                break;
        }
    })
    
commentRouter.put("/:id",
    RequestJwtAuthorized,
    ValidContent,
    CheckFormatErrors,
    async (request: any, response: Response) => {

        let user: UserResponse = request.user;
        let updateData: CommentRequest = new CommentRequest(request.body.content);

        let updateResult = await dataManager.commentRepo.UpdateWitchUserCheck(request.params.id, user.id, updateData);

        switch (updateResult) {
            case UpdateResult.WrongUser:
                response.sendStatus(403);
                break;
            case UpdateResult.Updated:
                response.sendStatus(204);
                break;
            default:
                response.sendStatus(404);
                break;
        }
    })