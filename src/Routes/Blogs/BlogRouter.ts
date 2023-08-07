import { Request, Response, Router } from "express";
import { RequestBlogData } from "../../Repos/Entities/Blog";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from "../Types/Requests";
import { CheckFormatErrors, RequestAuthorized, ValidBlogFields } from "../Validation/RequestCheck";
import { _BlogRepo } from "../../Repos/BlogRepo";



export const blogRouter = Router();

blogRouter.get("", async (request: Request, response: Response) => {
    let requestedData = await _BlogRepo.takeAll();
    response.status(200).send(requestedData)
})

blogRouter.get("/:id",
    async (request: RequestWithParams<{ id: string }>, response: Response) => {
        let requestedId = request.params.id;
        let requestedData = await _BlogRepo.take(requestedId);

        if (!requestedData) {
            response.sendStatus(404);
        }
        response.status(200).send(requestedData);
    })

blogRouter.post("",
    RequestAuthorized,
    ValidBlogFields,
    CheckFormatErrors,
    async (request: RequestWithBody<RequestBlogData>, response: Response) => {
        let savedBlog = await _BlogRepo.add(request.body);
        response.status(201).send(savedBlog);
    })


blogRouter.put("/:id",
    RequestAuthorized,
    ValidBlogFields,
    CheckFormatErrors,
    async (request: RequestWithParamsAndBody<{ id: string }, RequestBlogData>, response: Response) => {
        let requestedId = request.params.id;
        let updateResultIsPositive = await _BlogRepo.update(requestedId, request.body);

        if (updateResultIsPositive) {
            response.sendStatus(204);
            return;
        }
        response.sendStatus(404);
    })

blogRouter.delete("/:id",
    RequestAuthorized,
    async (request: RequestWithParams<{ id: string }>, response: Response) => {
        let idVal = request.params.id;

        let blogIsDeleted = await _BlogRepo.delete(idVal);

        if (blogIsDeleted) {
            response.sendStatus(204)
        }
        else {
            response.sendStatus(404);
        }
    })


