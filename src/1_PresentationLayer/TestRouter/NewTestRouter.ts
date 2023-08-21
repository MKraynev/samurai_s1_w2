import { Request, Response, Router } from "express";
import { dataManager } from "../../2_BusinessLogicLayer/_Classes/DataManager";


export const _NewTestClearAllRouter = Router();

_NewTestClearAllRouter.delete("", async (request: Request, response: Response) => {
    let blogsDeleted = await dataManager.blogRepo.DeleteMany();
    let postsDeleted = await dataManager.postRepo.DeleteMany();
    let userssDeleted = await dataManager.userRepo.DeleteMany();

    if (blogsDeleted && postsDeleted && userssDeleted) {
        response.sendStatus(204);
    }
    else {
        response.sendStatus(404);
    }
})