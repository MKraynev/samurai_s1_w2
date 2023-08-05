import { Request, Response, Router } from "express";
import { _BlogRepo } from "../../Repos/Entities/Blog";
import { _PostRepo } from "../../Repos/Entities/Post";

export const _TestClearAllRouter = Router();

_TestClearAllRouter.delete("", (request: Request, response: Response) => {
    _BlogRepo.__clear__();
    _PostRepo.__clear__();
    response.sendStatus(204);
})


