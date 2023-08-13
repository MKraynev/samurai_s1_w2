import { Router, Request, Response } from "express";
import { _BlogRepo } from "../../_legacy/Repos/BlogRepo";
import { Sorter } from "../../3_DataAccessLayer/_Classes/DataManagment/Sorter";
import { PageHandler } from "../../3_DataAccessLayer/_Classes/DataManagment/PageHandler";
import { RequestParser } from "../_Classes/RequestManagment/RequestParser";
import { dataManager } from "../../2_BusinessLogicLayer/_Classes/DataManager";



export const blogRouter = Router();

blogRouter.get("", async (request: Request, response: Response) => {
    
    let searchParams = RequestParser.ReadQuery(Sorter, request);
    let pageHandler = RequestParser.ReadQuery(PageHandler, request);

    let foundValues = await dataManager.blogRepo.TakeAll(searchParams, pageHandler);
    let returnValues = foundValues || [];
    
    response.status(200).send(returnValues)
})

// blogRouter.get("/:id",
//     async (request: RequestWithParams<{ id: string }>, response: Response) => {
//         // 
//         // let requestedData = await _BlogRepo.take(requestedId);

//         // if (requestedData === null) {
//         //     response.sendStatus(404);
//         //     return;
//         // }
//         // response.status(200).send(requestedData);
//     })

// blogRouter.post("",
//     RequestAuthorized,
//     ValidBlogFields,
//     CheckFormatErrors,
//     async (request: RequestWithBody<RequestSaveBlogData>, response: Response) => {
//         // let savedBlog = await _BlogRepo.add(request.body);
//         // response.status(201).send(savedBlog);
//     })


// blogRouter.put("/:id",
//     RequestAuthorized,
//     ValidBlogFields,
//     CheckFormatErrors,
//     async (request: RequestWithParamsAndBody<{ id: string }, RequestBlogData>, response: Response) => {
//         // let requestedId = request.params.id;
//         // let updateResultIsPositive = await _BlogRepo.update(requestedId, request.body);

//         // if (updateResultIsPositive) {
//         //     response.sendStatus(204);
//         //     return;
//         // }
//         // response.sendStatus(404);
//     })

// blogRouter.delete("/:id",
//     RequestAuthorized,
//     CheckFormatErrors,
//     async (request: RequestWithParams<{ id: string }>, response: Response) => {
//         // let idVal = request.params.id;

//         // let blogIsDeleted = await _BlogRepo.delete(idVal);

//         // if (blogIsDeleted) {
//         //     response.sendStatus(204);

//         // }
//         // else {
//         //     response.sendStatus(404);
//         // }
//     })

