import { Request, Response, Router } from "express";
import { dataManager } from "../../2_BusinessLogicLayer/_Classes/DataManager";


export const _NewTestClearAllRouter = Router();

_NewTestClearAllRouter.delete("", async (request: Request, response: Response) => {
    let deleteResult = await dataManager.blogRepo.DeleteMany();
    if (deleteResult) {
        response.sendStatus(204)
    }
    else {
        response.sendStatus(404)
    }
})