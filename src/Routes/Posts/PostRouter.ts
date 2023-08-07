import { Request, Response, Router } from "express";
import { Post } from "../../Repos/Entities/Post";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from "../Types/Requests";
import { CheckFormatErrors, RequestAuthorized, ValidPostFields } from "../Validation/RequestCheck";
import { _PostRepo } from "../../Repos/PostRepo";


export const postRouter = Router();

postRouter.get("", async (request: Request, response: Response) => {
    let result = await _PostRepo.take();
    response.status(200).send(result);
})

postRouter.get("/:id",
    async (request: RequestWithParams<{ id: string }>, response: Response) => {
        let requestedId = request.params.id;
        let requestedData = await _PostRepo.take(requestedId);

        if (!requestedData) {
            response.sendStatus(404);
        }
        response.status(200).send(requestedData);
    })

postRouter.post("",
    RequestAuthorized,
    ValidPostFields,
    CheckFormatErrors,
    async (request: RequestWithBody<Post>, response: Response) => {
        let savedBlog = await _PostRepo.add(request.body);
        response.status(201).send(savedBlog);
    })


postRouter.put("/:id",
    RequestAuthorized,
    ValidPostFields,
    CheckFormatErrors,
    async (request: RequestWithParamsAndBody<{ id: string }, Post>, response: Response) => {
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
        }
        else {
            response.sendStatus(404);
        }
    })


