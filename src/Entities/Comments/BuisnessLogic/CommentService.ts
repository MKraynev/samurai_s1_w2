import { Request } from "express"
import { AdminAuthentication, AuthenticationResult, IAuthenticator } from "../../../Common/Authentication/Admin/AdminAuthenticator";
import { AvailableDbTables, ExecutionResult, ExecutionResultContainer } from "../../../Common/Database/DataBase";
import { MongoDb, mongoDb } from "../../../Common/Database/MongoDb";
import { ServiseExecutionStatus } from "../../Blogs/BuisnessLogic/BlogService";
import { CommentResponse } from "../Entities/CommentForResponse";
import { Token } from "../../Users/Common/Entities/Token";
import { UserServiceExecutionResult, userService } from "../../Users/Common/BuisnessLogic/UserService";

type CommentServiceDto = ExecutionResultContainer<ExecutionResult, CommentResponse>;

export enum CommentServiceExecutionResult {
    DataBaseFailed,
    Unauthorized,
    WrongUser,
    NotFound,
    ServiceFail,
    Success
}

class CommentService {
    private commentTable = AvailableDbTables.comments;

    constructor(private _db: MongoDb) { }

    public async GetCommentById(id: string): Promise<ExecutionResultContainer<CommentServiceExecutionResult, CommentResponse | null>> {
        let foundObjectsOperation = await this._db.GetOneById(this.commentTable, id) as CommentServiceDto;

        if (foundObjectsOperation.executionStatus === ExecutionResult.Failed) {
            return new ExecutionResultContainer(CommentServiceExecutionResult.DataBaseFailed);
        }

        if (!foundObjectsOperation.executionResultObject)
            return new ExecutionResultContainer(CommentServiceExecutionResult.NotFound);

        return new ExecutionResultContainer(CommentServiceExecutionResult.Success, foundObjectsOperation.executionResultObject);
    }
    public async DeleteComment(id: string, userToken: Token): Promise<ExecutionResultContainer<CommentServiceExecutionResult, boolean | null>> {

        let findUser = await userService.GetUserByToken(userToken);
        let findComment = await this._db.GetOneById(this.commentTable, id) as CommentServiceDto;

        if (findUser.executionStatus === UserServiceExecutionResult.NotFound ||
            !findUser.executionResultObject)
            return new ExecutionResultContainer(CommentServiceExecutionResult.Unauthorized);

        if (findComment.executionStatus === ExecutionResult.Failed ||
            !findComment.executionResultObject)
            return new ExecutionResultContainer(CommentServiceExecutionResult.NotFound);

        let user = findUser.executionResultObject;
        let comment = findComment.executionResultObject;

        if (user.id !== comment.commentatorInfo.userId)
            return new ExecutionResultContainer(CommentServiceExecutionResult.Unauthorized);


        let deleteOperation = await this._db.DeleteOne(this.commentTable, id);

        if (deleteOperation.executionStatus === ExecutionResult.Failed ||
            !deleteOperation.executionResultObject)
            return new ExecutionResultContainer(CommentServiceExecutionResult.DataBaseFailed);


        return new ExecutionResultContainer(CommentServiceExecutionResult.Success, true);
    }

    public async UpdateComment(id: string, userToken: Token, content: string): Promise<ExecutionResultContainer<CommentServiceExecutionResult, CommentResponse | null>> {
        let findUser = await userService.GetUserByToken(userToken);
        let findComment = await this._db.GetOneById(this.commentTable, id) as CommentServiceDto;

        if (findUser.executionStatus === UserServiceExecutionResult.NotFound ||
            !findUser.executionResultObject)
            return new ExecutionResultContainer(CommentServiceExecutionResult.Unauthorized);

        if (findComment.executionStatus === ExecutionResult.Failed ||
            !findComment.executionResultObject)
            return new ExecutionResultContainer(CommentServiceExecutionResult.NotFound);

        let user = findUser.executionResultObject;
        let comment = findComment.executionResultObject;

        if (user.id !== comment.commentatorInfo.userId)
            return new ExecutionResultContainer(CommentServiceExecutionResult.Unauthorized);

        let updateComment = await this._db.UpdateOneProperty(this.commentTable, id, "content", content) as CommentServiceDto;
        if (updateComment.executionStatus === ExecutionResult.Failed ||
            !updateComment.executionResultObject)
            return new ExecutionResultContainer(CommentServiceExecutionResult.DataBaseFailed);

            return new ExecutionResultContainer(CommentServiceExecutionResult.Success, updateComment.executionResultObject);
    }
}

export const commentService = new CommentService(mongoDb);