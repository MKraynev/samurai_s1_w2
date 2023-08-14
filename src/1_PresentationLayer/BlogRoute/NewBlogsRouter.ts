import { Router, Request, Response } from "express";
import { RequestParser } from "../_Classes/RequestManagment/RequestParser";
import { dataManager } from "../../2_BusinessLogicLayer/_Classes/DataManager";
import { CompleteRequest, RequestWithBody, RequestWithParams } from "../_Types/RequestTypes";
import { CheckFormatErrors, RequestAuthorized, ValidBlogFields } from "../../_legacy/Routes/Validation/RequestCheck";
import { BlogRequest } from "../_Classes/Data/BlogForRequest";



export const blogRouter = Router();

blogRouter.get("", async (request: Request, response: Response) => {

    let searchParams = RequestParser.ReadQueryBlogSorter(request);
    let pageHandler = RequestParser.ReadQueryPageHandle(request);

    let foundValues = await dataManager.blogRepo.TakeAll(searchParams, pageHandler);
    let returnValues = foundValues || [];

    response.status(200).send(returnValues)
})

blogRouter.get("/:id",
    async (request: RequestWithParams<{ id: string }>, response: Response) => {

        let foundValue = await dataManager.blogRepo.TakeCertain(request.params.id);
        if (foundValue) {
            response.status(200).send(foundValue);
        }
        else {
            response.sendStatus(404);
        }

    })

blogRouter.post("",
    RequestAuthorized,
    ValidBlogFields,
    CheckFormatErrors,
    async (request: RequestWithBody<BlogRequest>, response: Response) => {
        let reqObj = new BlogRequest(request.body.name, request.body.description, request.body.websiteUrl);

        let savedBlog = await dataManager.blogRepo.Save(reqObj);
        if (savedBlog) {
            response.status(201).send(savedBlog);
        }
        else {
            response.sendStatus(400);
        }
    })


blogRouter.put("/:id",
    RequestAuthorized,
    ValidBlogFields,
    CheckFormatErrors,
    async (request: CompleteRequest<{ id: string }, BlogRequest, {}>, response: Response) => {
        let reqData: BlogRequest = new BlogRequest(request.body.name, request.body.description, request.body.websiteUrl)
        let requestedId = request.params.id;
        let updateResultIsPositive = await dataManager.blogRepo.Update(requestedId, reqData);

        if (updateResultIsPositive) {
            response.sendStatus(204);
            return;
        }
        response.sendStatus(404);
    })

blogRouter.delete("/:id",
    RequestAuthorized,
    CheckFormatErrors,
    async (request: RequestWithParams<{ id: string }>, response: Response) => {
        let idVal = request.params.id;

        let blogDeleted = await dataManager.blogRepo.DeleteCertain(idVal);

        if (blogDeleted) {
            response.sendStatus(204);
        }
        else {
            response.sendStatus(404);
        }
    })

