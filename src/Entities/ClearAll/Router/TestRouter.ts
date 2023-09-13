import { Request, Response, Router } from "express";
import { dataManager } from "../../../Common/Data/DataManager/DataManager";


export const _NewTestClearAllRouter = Router();

_NewTestClearAllRouter.delete("", async (request: Request, response: Response) => {
    let blogsDeleted = await dataManager.blogRepo.DeleteMany();
    let postsDeleted = await dataManager.postRepo.DeleteMany();
    let usersDeleted = await dataManager.userService.ClearUsers();
    let commentDeleted = await dataManager.commentRepo.DeleteMany();
    
    if (blogsDeleted && postsDeleted && usersDeleted && commentDeleted) {
        response.sendStatus(204);
    }
    else {
        response.sendStatus(404);
    }
    return;
})