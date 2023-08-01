import { Request, Response, Router } from "express";
import { _BlogRepo, Blog } from "../../Repos/Blogs/BlogRepo";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from "../Types/Requests";
import { CheckFormatErrors, RequestAuthorized, RequestContainsBlog, ValidBlogFields } from "../Validation/RequestCheck";


export const blogRouter = Router();

blogRouter.get("", (request: Request, response: Response) => {
    response.send(_BlogRepo.take())
})

blogRouter.get("/:id",
    (request: RequestWithParams<{ id: string }>, response: Response) => {
        let requestedId = request.params.id;
        let requestedData = _BlogRepo.take(requestedId);

        if (!requestedData) {
            response.send(404);
        }
        response.send(requestedData);
    })

blogRouter.post("",
    RequestAuthorized,
    RequestContainsBlog,
    ValidBlogFields,
    CheckFormatErrors,
    (request: RequestWithBody<Blog>, response: Response) => {
        let savedBlog = _BlogRepo.add(request.body);
        response.status(201).send(savedBlog);
    })


blogRouter.put("/:id",
    RequestAuthorized,
    RequestContainsBlog,
    ValidBlogFields,
    CheckFormatErrors,
    (request: RequestWithParamsAndBody<{ id: string }, Blog>, response: Response) => {
        let requestedId = request.params.id;
        let updateResultIsPositive = _BlogRepo.update(requestedId, request.body);

        if (updateResultIsPositive) {
            response.sendStatus(204);
            return;
        }
        response.sendStatus(404);
    })

blogRouter.delete("/:id",
    RequestAuthorized,
    (request: RequestWithParams<{ id: string }>, response: Response) => {
        let idVal = request.params.id;

        let blogIsDeleted = _BlogRepo.delete(idVal);

        if (blogIsDeleted) {
            response.sendStatus(204)
        }
        else {
            response.sendStatus(404);
        }
    })

