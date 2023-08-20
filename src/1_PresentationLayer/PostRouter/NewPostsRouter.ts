import { Router, Request, Response } from "express";
import { RequestParser } from "../_Classes/RequestManagment/RequestParser";
import { dataManager } from "../../2_BusinessLogicLayer/_Classes/DataManager";
import { CompleteRequest, RequestWithBody, RequestWithParams } from "../_Types/RequestTypes";
import { BlogIdExist, CheckFormatErrors, RequestAuthorized, ValidPostFields } from "../../_legacy/Routes/Validation/RequestCheck";
import { PostRequest } from "../_Classes/Data/PostForRequest";

export const postRouter = Router();

postRouter.get("", async (request: Request, response: Response) => {

    let searchParams = RequestParser.ReadQueryPostSorter(request);
    let pageHandler = RequestParser.ReadQueryPageHandle(request);

    let foundValues = await dataManager.postRepo.TakeAll(searchParams, pageHandler);
    let returnValues = foundValues || [];

    response.status(200).send(returnValues)
})

postRouter.get("/:id",
    async (request: RequestWithParams<{ id: string }>, response: Response) => {
        let reqId = request.params.id;
        let foundValue = await dataManager.postRepo.TakeCertain(reqId);
        if (foundValue) {
            response.status(200).send(foundValue);
        }
        else {
            response.sendStatus(404);
        }

    })

postRouter.post("",
    RequestAuthorized,
    ValidPostFields,
    BlogIdExist,
    CheckFormatErrors,
    async (request: RequestWithBody<PostRequest>, response: Response) => {
        let existedBlog = await dataManager.blogRepo.TakeCertain(request.body.blogId);
        if (existedBlog) {
            let reqObj = new PostRequest(
                request.body.title, request.body.shortDescription, request.body.content, request.body.blogId, existedBlog.name);
            //Blog exist
            let savedPost = await dataManager.postRepo.Save(reqObj);
            if (savedPost) {
                response.status(201).send(savedPost);
                return;
            }
        }
        response.sendStatus(404);

    })
postRouter.put("/:id",
    RequestAuthorized,
    ValidPostFields,
    BlogIdExist,
    CheckFormatErrors,
    async (request: CompleteRequest<{ id: string }, PostRequest, {}>, response: Response) => {
        let requestedBlogId = request.body.blogId;
        let requestedPostId = request.params.id;

        let existedBlog = await dataManager.blogRepo.TakeCertain(requestedBlogId);
        let requestedPost = await dataManager.postRepo.TakeCertain(requestedPostId);
        if (existedBlog && requestedPost) {
            let reqData: PostRequest = new PostRequest(
                request.body.title, request.body.shortDescription, request.body.content, request.body.blogId, existedBlog.name)

            let updateResultIsPositive = await dataManager.postRepo.Update(requestedPostId, reqData);

            if (updateResultIsPositive) {
                response.sendStatus(204);
                return;
            }
        }
        response.sendStatus(404);
    })
postRouter.delete("/:id",
    RequestAuthorized,
    CheckFormatErrors,
    async (request: RequestWithParams<{ id: string }>, response: Response) => {
        let idVal = request.params.id;

        let postDeleted = await dataManager.postRepo.DeleteCertain(idVal);

        if (postDeleted) {
            response.sendStatus(204);
        }
        else {
            response.sendStatus(404);
        }
    })