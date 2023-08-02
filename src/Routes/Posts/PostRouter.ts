import { Request, Response, Router } from "express";
import { PostData, _PostRepo } from "../../Repos/Posts/PostRepo";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from "../Types/Requests";
import { CheckFormatErrors, RequestAuthorized, ValidPostFields } from "../Validation/RequestCheck";


export const postRouter = Router();

postRouter.get("", (request: Request, response: Response) => {
    response.status(200).send(_PostRepo.take())
})

postRouter.get("/:id",
    (request: RequestWithParams<{ id: string }>, response: Response) => {
        let requestedId = request.params.id;
        let requestedData = _PostRepo.take(requestedId);

        if (!requestedData) {
            response.sendStatus(404);
        }
        response.status(200).send(requestedData);
    })

postRouter.post("",
    RequestAuthorized,
    ValidPostFields,
    CheckFormatErrors,
    (request: RequestWithBody<PostData>, response: Response) => {
        let savedBlog = _PostRepo.add(request.body);
        response.status(201).send(savedBlog);
    })


postRouter.put("/:id",
    RequestAuthorized,
    ValidPostFields,
    CheckFormatErrors,
    (request: RequestWithParamsAndBody<{ id: string }, PostData>, response: Response) => {
        let requestedId = request.params.id;
        let updateResultIsPositive = _PostRepo.update(requestedId, request.body);

        if (updateResultIsPositive) {
            response.sendStatus(204);
            return;
        }
        response.sendStatus(404);
    })

postRouter.delete("/:id",
    RequestAuthorized,
    (request: RequestWithParams<{ id: string }>, response: Response) => {
        let idVal = request.params.id;

        let blogIsDeleted = _PostRepo.delete(idVal);

        if (blogIsDeleted) {
            response.sendStatus(204)
        }
        else {
            response.sendStatus(404);
        }
    })


