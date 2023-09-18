import {Request} from "express"
import { AuthenticationResult, IAuthenticator } from "../../../Common/Authentication/Admin/AdminAuthenticator";
import { AvailableDbTables, ExecutionResult, ExecutionResultContainer } from "../../../Common/Database/DataBase";
import { MongoDb } from "../../../Common/Database/MongoDb";
import { ServiseExecutionStatus } from "../../Blogs/BuisnessLogic/BlogService";
import { CommentResponse } from "../Entities/CommentForResponse";

type CommentServiceDto = ExecutionResultContainer<ExecutionResult, CommentResponse>;

class CommentService{
    private commentTable = AvailableDbTables.comments;

    constructor(private _db: MongoDb, private _authenticator: IAuthenticator) { }
    
    public async GetCommentById(id: string): Promise<ExecutionResultContainer<ServiseExecutionStatus, CommentResponse | null>> {
        let foundObjectsOperation = await this._db.GetOneById(this.commentTable, id) as CommentServiceDto;

        if (foundObjectsOperation.executionStatus === ExecutionResult.Failed) {
            return new ExecutionResultContainer(ServiseExecutionStatus.DataBaseFailed);
        }

        if (!foundObjectsOperation.executionResultObject)
            return new ExecutionResultContainer(ServiseExecutionStatus.NotFound);

        return new ExecutionResultContainer(ServiseExecutionStatus.Success, foundObjectsOperation.executionResultObject);
    }
    public async DeleteBlog(id: string, request: Request<{}, {}, {}, {}>): Promise<ExecutionResultContainer<ServiseExecutionStatus, boolean | null>> {
        let accessVerdict = this._authenticator.AccessCheck(request);

        if (accessVerdict !== AuthenticationResult.Accept)
            return new ExecutionResultContainer(ServiseExecutionStatus.Unauthorized);

        let deleteOperation = await this._db.DeleteOne(this.commentTable, id);

        if (deleteOperation.executionStatus === ExecutionResult.Failed)
            return new ExecutionResultContainer(ServiseExecutionStatus.DataBaseFailed);

        if (!deleteOperation.executionResultObject) {
            return new ExecutionResultContainer(ServiseExecutionStatus.NotFound);
        }

        return new ExecutionResultContainer(ServiseExecutionStatus.Success, true);
    }

}