import { Request, Response, Router } from "express";
import { _BLOGS_, Blog } from "../../Repos/Blogs/BlogRepo";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from "../Types/Requests";
import { CheckFormatErrors, RequestAuthorized, RequestContainsBlog, RequestContainsId, bodyFieldIsUri, bodyFieldLength, bodyFieldNotEmpty } from "./Validation/RequestCheck";
export const blogRouter = Router();

blogRouter.get("", (request: Request, response: Response) => {
    response.send(_BLOGS_.take())
})
blogRouter.get("/:id",
    RequestContainsId,
    (request: RequestWithParams<{ id: string }>, response: Response) => {
        let requestedId = request.params.id;
        let requestedData = _BLOGS_.take(requestedId);

        if (!requestedData) {
            response.send(404);
        }
        response.send(requestedData);
    })

blogRouter.post("",
    RequestAuthorized,
    RequestContainsBlog,
    bodyFieldNotEmpty("name"), bodyFieldLength("name", 3, 40),
    bodyFieldNotEmpty("description"), bodyFieldLength("description", 3, 40),
    bodyFieldNotEmpty("websiteUrl"), bodyFieldLength("websiteUrl", 3, 40), bodyFieldIsUri("websiteUrl"),
    CheckFormatErrors,
    (request: RequestWithBody<Blog>, response: Response) => {
        let savedBlog = _BLOGS_.add(request.body);
        response.status(201).send(savedBlog);
    })

blogRouter.put("/:id",
    RequestContainsId,
    RequestAuthorized,
    RequestContainsBlog,
    bodyFieldNotEmpty("name"), bodyFieldLength("name", 3, 40),
    bodyFieldNotEmpty("description"), bodyFieldLength("description", 3, 40),
    bodyFieldNotEmpty("websiteUrl"), bodyFieldLength("websiteUrl", 3, 40), bodyFieldIsUri("websiteUrl"),
    CheckFormatErrors,
    (request: RequestWithParamsAndBody<{ id: string }, Blog>, response: Response) => {
        let requestedId = request.params.id;
        let updateResultIsPositive = _BLOGS_.update(requestedId, request.body);

        if (updateResultIsPositive) {
            response.sendStatus(204);
            return;
        }
        response.sendStatus(404);
    })

blogRouter.delete("/:id",
    RequestContainsId,
    RequestAuthorized,
    (request: RequestWithParams<{ id: string }>, response: Response) => {
        let idVal = request.params.id;

        let blogIsDeleted = _BLOGS_.delete(idVal);

        if (blogIsDeleted) {
            response.sendStatus(204)
        }
        else {
            response.sendStatus(404);
        }
    })
