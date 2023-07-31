import { Request, Response, Router } from "express";
import { _BLOGS_, Blog } from "../../Repos/Blogs/BlogRepo";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from "../Types/Requests";
import { RequestAuthorized, RequestContainsBlog, RequestContainsId } from "./Validation/RequestCheck";
export const blogRouter = Router();

blogRouter.get("", (request: Request, response: Response) => {
    response.send(_BLOGS_.take())
})
blogRouter.get("/:id",
    RequestContainsId,
    (request: RequestWithParams<{ id: number }>, response: Response) => {
        let requestedId: number = +request.params.id;
        let requestedData = _BLOGS_.take(requestedId);

        if (!requestedData) {
            response.send(404);
        }
        response.send(requestedData);
    })

blogRouter.post("",
    RequestAuthorized,
    RequestContainsBlog,
    (request: RequestWithBody<Blog>, response: Response) => {
        let savedBlog = _BLOGS_.add(request.body);
        response.status(201).send(savedBlog);
    })

blogRouter.put("/:id",
    RequestContainsId,
    RequestAuthorized,
    RequestContainsBlog,
    (request: RequestWithParamsAndBody<{ id: number }, Blog>, response: Response) => {
        let requestedId = +request.params.id;
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
    (request: RequestWithParams<{ id: number }>, response: Response) => {
        let idVal = +request.params.id;

        let blogIsDeleted = _BLOGS_.delete(idVal);
        
        if(blogIsDeleted){
            response.sendStatus(204)
        }
        else{
            response.sendStatus(404);
        }
    })
