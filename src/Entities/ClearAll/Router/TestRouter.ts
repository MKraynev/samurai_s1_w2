import { Request, Response, Router } from "express";
import { mongoDb } from "../../../Common/Database/MongoDb";
import { AvailableDbTables } from "../../../Common/Database/DataBase";
// import { dataManager } from "../../../Common/DataManager/DataManager";


export const _NewTestClearAllRouter = Router();

_NewTestClearAllRouter.delete("", async (request: Request, response: Response) => {
    // let blogsDeleted = await dataManager.blogRepo.DeleteMany();
    let blogsDeleted = await mongoDb.DeleteAll(AvailableDbTables.blogs);
    let postsDeleted = await mongoDb.DeleteAll(AvailableDbTables.posts);
    // let usersDeleted = await dataManager.userService.ClearUsers();
    // let commentDeleted = await dataManager.commentRepo.DeleteMany();
    
    response.sendStatus(204);

    // if (blogsDeleted && postsDeleted && usersDeleted && commentDeleted) {
    //     response.sendStatus(204);
    // }
    // else {
    //     response.sendStatus(404);
    // }
    // return;
})