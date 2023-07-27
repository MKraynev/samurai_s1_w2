import { Request, Response, Router } from "express";
import { _BLOGS_ } from "../Repos/Blogs/BlogRepo";

export const blogRouter = Router();

blogRouter.get("", (request : Request, response : Response) => {
    response.send(_BLOGS_.take())
})
blogRouter.get("/:id")