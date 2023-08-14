import { Request, Response, Router } from "express";
import { dataManager } from "../../2_BusinessLogicLayer/_Classes/DataManager";


export const _NewTestClearAllRouter = Router();

_NewTestClearAllRouter.delete("", (request: Request, response: Response) => {
    dataManager.blogRepo.DeleteMany();
})