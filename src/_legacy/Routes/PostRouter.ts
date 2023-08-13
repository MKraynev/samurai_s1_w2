import { Request, Response, Router } from "express";
import { RequestPostData } from "../Repos/Entities/Post";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from "./Types/Requests";
import { BlogIdExist, CheckFormatErrors, RequestAuthorized, ValidPostFields } from "./Validation/RequestCheck";
import { _PostRepo } from "../Repos/PostRepo";


export const postRouter = Router();

postRouter.get("", async (request: Request, response: Response) => {
    let result = await _PostRepo.takeAll();
    response.status(200).send(result);
})

postRouter.get("/:id",
    async (request: RequestWithParams<{ id: string }>, response: Response) => {
        let requestedId = request.params.id;
        let requestedData = await _PostRepo.take(requestedId);

        if (requestedData === null) {
            response.sendStatus(404);
            return;
        }
        response.status(200).send(requestedData);
    })

postRouter.post("",
    RequestAuthorized,
    ValidPostFields,
    BlogIdExist,
    CheckFormatErrors,
    
    async (request: RequestWithBody<RequestPostData>, response: Response) => {
        let savedBlog = await _PostRepo.add(request.body);
        response.status(201).send(savedBlog);
    })


postRouter.put("/:id",
    RequestAuthorized,
    ValidPostFields,
    BlogIdExist,
    CheckFormatErrors,
    async (request: RequestWithParamsAndBody<{ id: string }, RequestPostData>, response: Response) => {
        let requestedId = request.params.id;
        let updateResultIsPositive = await _PostRepo.update(requestedId, request.body);

        if (updateResultIsPositive) {
            response.sendStatus(204);
            return;
        }
        response.sendStatus(404);
    })

postRouter.delete("/:id",
    RequestAuthorized,
    async (request: RequestWithParams<{ id: string }>, response: Response) => {
        let idVal = request.params.id;

        let blogIsDeleted = await _PostRepo.delete(idVal);

        if (blogIsDeleted) {
            response.sendStatus(204)
            return;
        }
        else {
            response.sendStatus(404);
        }
    })
