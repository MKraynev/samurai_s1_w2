import { Request, Response, Router } from "express";
import { _BlogRepo } from "../../Repos/Blogs/BlogRepo";

export const _TestClearAllRouter = Router();

_TestClearAllRouter.delete("", (request: Request, response: Response) => {
    _BlogRepo.__clear__();
    response.sendStatus(204);
})


