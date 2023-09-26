import { Router, Request, Response } from "express";
import { ParseAccessToken } from "../../Users/Common/Router/Middleware/AuthMeddleware";
import { Token } from "../../Users/Common/Entities/Token";
import { deviceService } from "../BuisnessLogic/DeviceService";
import { ServiseExecutionStatus } from "../../Blogs/BuisnessLogic/BlogService";
import { RequestWithParams } from "../../../Common/Request/Entities/RequestTypes";


export const deviceRouter = Router();


deviceRouter.get("",
    ParseAccessToken,
    async (request: Request, response: Response) => {
        let token: Token = request.accessToken;
        let search = await deviceService.GetUserDevices(token);

        switch (search.executionStatus) {
            case ServiseExecutionStatus.Success:
                let result = search.executionResultObject || [];
                response.status(200).send(result);
                break;

            case ServiseExecutionStatus.DataBaseFailed:
            case ServiseExecutionStatus.Unauthorized:
            default:
                response.sendStatus(401);
                break;
        }
    })

deviceRouter.delete("",
    ParseAccessToken,
    async (request: Request, response: Response) => {
        let token: Token = request.accessToken;
        let deleteDevises = await deviceService.DeleteDevices(token);

        switch (deleteDevises.executionStatus) {
            case ServiseExecutionStatus.Success:

                response.sendStatus(204);
                break;

            case ServiseExecutionStatus.DataBaseFailed:
            case ServiseExecutionStatus.Unauthorized:
            default:
                response.sendStatus(401);
                break;
        }
    }
)

deviceRouter.delete("/:id",
    ParseAccessToken,
    async (request: RequestWithParams<{ id: string }>, response: Response) => {
        let token: Token = request.accessToken;
        let idParse = +request.params.id;
        let id = idParse ? idParse : - 2;


        let deleteDevises = await deviceService.DeleteDevices(token, id);

        switch (deleteDevises.executionStatus) {
            case ServiseExecutionStatus.Success:

                response.sendStatus(204);
                break;

            case ServiseExecutionStatus.DataBaseFailed:
            case ServiseExecutionStatus.Unauthorized:
                response.sendStatus(401);
                break;

            case ServiseExecutionStatus.NotFound:
                response.sendStatus(404);
                break;
        }
    }
)
