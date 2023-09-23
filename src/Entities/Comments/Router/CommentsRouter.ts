import { Router, Response } from "express";
import { CompleteRequest, RequestWithParams } from "../../../Common/Request/Entities/RequestTypes";
import { ValidCommentFields } from "./Middleware/CommentMiddleware";
import { CommentServiceExecutionResult, commentService } from "../BuisnessLogic/CommentService";
import { Token } from "../../Users/Common/Entities/Token";
import { CheckFormatErrors } from "../../../Common/Request/RequestValidation/RequestValidation";
import { ParseAccessToken } from "../../Users/Common/Router/Middleware/AuthMeddleware";

export const commentRouter = Router();

commentRouter.get("/:id",
    async (request: RequestWithParams<{ id: string }>, response: Response) => {

        let findComment = await commentService.GetCommentById(request.params.id);

        switch (findComment.executionStatus) {
            case CommentServiceExecutionResult.Success:
                let comment = findComment.executionResultObject;
                if (comment) {
                    response.status(200).send(comment);
                    return;
                }

            case CommentServiceExecutionResult.DataBaseFailed:
            case CommentServiceExecutionResult.NotFound:
            default:
                response.sendStatus(404);
                break;
        }

        // let comment = await dataManager.commentRepo.TakeCertain(request.params.id);
        // if (comment) {
        //     response.status(200).send(comment);
        //     return;
        // }
        // 
        // return;
    })

commentRouter.delete("/:id",
    ParseAccessToken,
    async (request: RequestWithParams<{ id: string }>, response: Response) => {
        let id = request.params.id;
        let token = request.accessToken;

        if (!token) {
            response.sendStatus(404);
            return;
        }

        let deleteComment = await commentService.DeleteComment(id, token);

        switch (deleteComment.executionStatus) {
            case CommentServiceExecutionResult.Success:
                if (deleteComment.executionResultObject) {
                    response.sendStatus(204);
                    return;
                }

            case CommentServiceExecutionResult.Unauthorized:
                response.sendStatus(401);
                break;

            case CommentServiceExecutionResult.WrongUser:
                response.sendStatus(403);
                break;

            case CommentServiceExecutionResult.NotFound:
            case CommentServiceExecutionResult.DataBaseFailed:
            default:
                response.sendStatus(404);
                break;
        }
        // let deleteResult = await dataManager.commentRepo.DeleteCertainWithUserCheck(request.params.id, user.id);

        // switch (deleteResult) {
        //     case DeleteResult.WrongUser:
        //         response.sendStatus(403);
        //         break;
        //     case DeleteResult.Deleted:
        //         response.sendStatus(204);
        //         break;
        //     default:
        //         response.sendStatus(404);
        //         break;
        // }
        // return;
    })

commentRouter.put("/:id",
    ValidCommentFields,
    ParseAccessToken,
    CheckFormatErrors,
    async (request: CompleteRequest<{ id: string }, { content: string }, {}>, response: Response) => {
        let commentId = request.params.id;
        let userToken = request.accessToken;
        let content = request.body.content;

        let updateComment = await commentService.UpdateComment(commentId, userToken, content);

        switch (updateComment.executionStatus) {
            case CommentServiceExecutionResult.Success:
                if (updateComment.executionResultObject) {
                    response.sendStatus(204);
                    return;
                }

            case CommentServiceExecutionResult.Unauthorized:
                response.sendStatus(401);
                break;

            case CommentServiceExecutionResult.WrongUser:
                response.sendStatus(403);
                break;

            case CommentServiceExecutionResult.NotFound:
            case CommentServiceExecutionResult.DataBaseFailed:
            default:
                response.sendStatus(404);
                break;
        }

        // let user: UserResponse = request.user;
        // let updateData: CommentRequest = new CommentRequest(request.body.content);

        // let updateResult = await dataManager.commentRepo.UpdateWitchUserCheck(request.params.id, user.id, updateData);

        // switch (updateResult) {
        //     case UpdateResult.WrongUser:
        //         response.sendStatus(403);
        //         break;
        //     case UpdateResult.Updated:
        //         response.sendStatus(204);
        //         break;
        //     default:
        //         response.sendStatus(404);
        //         break;
        // }
        // return;
    })