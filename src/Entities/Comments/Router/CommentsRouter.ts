import { Router, Request, Response } from "express";
// import { dataManager } from "../../../Common/DataManager/DataManager";
import { RequestWithParams } from "../../../Common/Request/Entities/RequestTypes";
// import { CheckFormatErrors, RequestJwtAuthorized } from "../../../Common/Request/RequestValidation/RequestValidation";
import { UserResponse } from "../../Users/Admin/Entities/UserForResponse";
import { DeleteResult, UpdateResult } from "../Repo/CommentsRepo";
import { CommentRequest } from "../Entities/CommentRequest";
import { ValidCommentFields } from "./Middleware/CommentMiddleware";

export const commentRouter = Router();

// commentRouter.get("/:id",
//     async (request: RequestWithParams<{ id: string }>, response: Response) => {
//         let comment = await dataManager.commentRepo.TakeCertain(request.params.id);
//         if (comment) {
//             response.status(200).send(comment);
//             return;
//         }
//         response.sendStatus(404);
//         return;
//     })

// commentRouter.delete("/:id",
//     RequestJwtAuthorized,
//     async (request: any, response: Response) => {
//         let user: UserResponse = request.user;
//         let deleteResult = await dataManager.commentRepo.DeleteCertainWithUserCheck(request.params.id, user.id);

//         switch (deleteResult) {
//             case DeleteResult.WrongUser:
//                 response.sendStatus(403);
//                 break;
//             case DeleteResult.Deleted:
//                 response.sendStatus(204);
//                 break;
//             default:
//                 response.sendStatus(404);
//                 break;
//         }
//         return;
//     })

// commentRouter.put("/:id",
//     RequestJwtAuthorized,
//     ValidCommentFields,
//     CheckFormatErrors,
//     async (request: any, response: Response) => {

//         let user: UserResponse = request.user;
//         let updateData: CommentRequest = new CommentRequest(request.body.content);

//         let updateResult = await dataManager.commentRepo.UpdateWitchUserCheck(request.params.id, user.id, updateData);

//         switch (updateResult) {
//             case UpdateResult.WrongUser:
//                 response.sendStatus(403);
//                 break;
//             case UpdateResult.Updated:
//                 response.sendStatus(204);
//                 break;
//             default:
//                 response.sendStatus(404);
//                 break;
//         }
//         return;
//     })