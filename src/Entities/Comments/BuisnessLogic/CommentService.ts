import { AvailableDbTables, ExecutionResult, ExecutionResultContainer } from "../../../Common/Database/DataBase";
import { MongoDb, mongoDb } from "../../../Common/Database/MongoDb";
import { CommentResponse } from "../Entities/CommentForResponse";
import { Token } from "../../Users/Common/Entities/Token";
import { UserServiceExecutionResult, userService } from "../../Users/Common/BuisnessLogic/UserService";
import { AvailableLikeStatus } from "../../Likes/Entities/LikeRequest";
import { CommentResponseExtended, LikesInfo } from "../Entities/CommentResponseExtended";
import { likeService } from "../../Likes/BuisnessLogic/LikeService";

type CommentServiceDto = ExecutionResultContainer<ExecutionResult, CommentResponse>;

export enum ServicesWithUsersExecutionResult {
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

    public async GetCommentById(id: string): Promise<ExecutionResultContainer<ServicesWithUsersExecutionResult, CommentResponseExtended | null>> {
        let foundObjectsOperation = await this._db.GetOneById(this.commentTable, id) as CommentServiceDto;

        if (foundObjectsOperation.executionStatus === ExecutionResult.Failed) {
            return new ExecutionResultContainer(ServicesWithUsersExecutionResult.DataBaseFailed);
        }

        if (!foundObjectsOperation.executionResultObject)
            return new ExecutionResultContainer(ServicesWithUsersExecutionResult.NotFound);


        let commentData = foundObjectsOperation.executionResultObject;

        let result = await commentData.UpgradeToExtended();

        return new ExecutionResultContainer(ServicesWithUsersExecutionResult.Success, result);
    }

    public async DeleteComment(id: string, userToken: Token): Promise<ExecutionResultContainer<ServicesWithUsersExecutionResult, boolean | null>> {

        let findUser = await userService.GetUserByToken(userToken);
        let findComment = await this._db.GetOneById(this.commentTable, id) as CommentServiceDto;

        if (findUser.executionStatus === UserServiceExecutionResult.NotFound ||
            !findUser.executionResultObject)
            return new ExecutionResultContainer(ServicesWithUsersExecutionResult.Unauthorized);

        if (findComment.executionStatus === ExecutionResult.Failed ||
            !findComment.executionResultObject)
            return new ExecutionResultContainer(ServicesWithUsersExecutionResult.NotFound);

        let user = findUser.executionResultObject;
        let comment = findComment.executionResultObject;

        if (user.id !== comment.commentatorInfo.userId)
            return new ExecutionResultContainer(ServicesWithUsersExecutionResult.WrongUser);


        let deleteOperation = await this._db.DeleteOne(this.commentTable, id);

        if (deleteOperation.executionStatus === ExecutionResult.Failed ||
            !deleteOperation.executionResultObject)
            return new ExecutionResultContainer(ServicesWithUsersExecutionResult.DataBaseFailed);


        return new ExecutionResultContainer(ServicesWithUsersExecutionResult.Success, true);
    }

    public async UpdateComment(id: string, userToken: Token, content: string): Promise<ExecutionResultContainer<ServicesWithUsersExecutionResult, CommentResponse | null>> {
        let findUser = await userService.GetUserByToken(userToken);
        let findComment = await this._db.GetOneById(this.commentTable, id) as CommentServiceDto;

        if (findUser.executionStatus === UserServiceExecutionResult.NotFound ||
            !findUser.executionResultObject)
            return new ExecutionResultContainer(ServicesWithUsersExecutionResult.Unauthorized);

        if (findComment.executionStatus === ExecutionResult.Failed ||
            !findComment.executionResultObject)
            return new ExecutionResultContainer(ServicesWithUsersExecutionResult.NotFound);

        let user = findUser.executionResultObject;
        let comment = findComment.executionResultObject;

        if (user.id !== comment.commentatorInfo.userId)
            return new ExecutionResultContainer(ServicesWithUsersExecutionResult.Unauthorized);

        let updateComment = await this._db.UpdateOneProperty(this.commentTable, id, "content", content) as CommentServiceDto;
        if (updateComment.executionStatus === ExecutionResult.Failed ||
            !updateComment.executionResultObject)
            return new ExecutionResultContainer(ServicesWithUsersExecutionResult.DataBaseFailed);

            return new ExecutionResultContainer(ServicesWithUsersExecutionResult.Success, updateComment.executionResultObject);
    }
}

export const commentService = new CommentService(mongoDb);