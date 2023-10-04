import { TokenHandler, TokenStatus, tokenHandler } from "../../../Common/Authentication/User/TokenAuthentication";
import { AvailableDbTables, ExecutionResult, ExecutionResultContainer } from "../../../Common/Database/DataBase";
import { MongoDb, mongoDb } from "../../../Common/Database/MongoDb";
import { Sorter, SorterType } from "../../../Common/Database/Sort/Sorter";
import { ServicesWithUsersExecutionResult, commentService } from "../../Comments/BuisnessLogic/CommentService";
import { UserServiceExecutionResult } from "../../Users/Common/BuisnessLogic/UserService";
import { Token } from "../../Users/Common/Entities/Token";
import { LikeDataBase } from "../Entities/LikeDataBase";
import { AvailableLikeStatus, AvailableLikeTarget, LikeRequest } from "../Entities/LikeRequest";
import { LikeResponse } from "../Entities/LikeResponse";

export class LikeSorter extends Sorter<LikeResponse>{
    constructor(
        public sorterType: SorterType,
        public userId: string | undefined,
        public status: AvailableLikeStatus | undefined,
        public target: AvailableLikeTarget,
        public sortBy: keyof LikeResponse & string = "userId",
        public sortDirection: "desc" | "asc" = "desc"
    ) {
        super(sortBy, sortDirection, sorterType)
    }
}
export type LikeCount = {
    likes: number,
    dislikes: number
}


class LikeService {
    private likeTable = AvailableDbTables.likes;

    constructor(private db: MongoDb, private tokenHandler: TokenHandler) { }

    public async Count(commentId: string): Promise<ExecutionResultContainer<UserServiceExecutionResult, LikeCount | null>> {
        let findComment = await commentService.GetCommentById(commentId);

        if (findComment.executionStatus !== ServicesWithUsersExecutionResult.Success || !findComment.executionResultObject) {
            return new ExecutionResultContainer(UserServiceExecutionResult.NotFound)
        }

        let likeSorter = new LikeSorter(SorterType.LikeSorter, undefined, "Like", "comments");
        let findLikesNumber = await this.db.Count(this.likeTable, likeSorter);

        likeSorter.status = "Dislike";
        let findDislikeNumber = await this.db.Count(this.likeTable, likeSorter);

        let result: LikeCount = {
            likes: findLikesNumber.executionResultObject || 0,
            dislikes: findDislikeNumber.executionResultObject || 0
        }

        return new ExecutionResultContainer(UserServiceExecutionResult.Success, result);
    }

    public async GetUserStatus(token: Token): Promise<ExecutionResultContainer<UserServiceExecutionResult, AvailableLikeStatus | null>> {
        let getTokenData = await this.tokenHandler.GetTokenLoad(token);

        if (getTokenData.tokenStatus !== TokenStatus.Accepted || !getTokenData.result) {
            return new ExecutionResultContainer(UserServiceExecutionResult.NotFound)
        }
        let tokenData = getTokenData.result;

        let userStatus: AvailableLikeStatus = "None";

        let findLike = await this.db.GetOneByValueInOnePropery(this.likeTable, "userId", tokenData.id) as ExecutionResultContainer<ExecutionResult, LikeResponse>;
        if(findLike.executionStatus === ExecutionResult.Pass && findLike.executionResultObject)
            userStatus = findLike.executionResultObject.status;
        
            return new ExecutionResultContainer(UserServiceExecutionResult.Success, userStatus);
    }

    public async Save(likeData: LikeRequest, token: Token): Promise<ExecutionResultContainer<UserServiceExecutionResult, LikeResponse | null>> {
        let getTokenData = await this.tokenHandler.GetTokenLoad(token);

        if (getTokenData.tokenStatus !== TokenStatus.Accepted || !getTokenData.result) {
            return new ExecutionResultContainer(UserServiceExecutionResult.Unauthorized)
        }
        let tokenData = getTokenData.result;

        let findComment = await commentService.GetCommentById(likeData.targetId);

        if (findComment.executionStatus !== ServicesWithUsersExecutionResult.Success || !findComment.executionResultObject) {
            return new ExecutionResultContainer(UserServiceExecutionResult.NotFound)
        }

        let findLike = await this.db.GetOneByTwoProperties(this.likeTable, "target", likeData.target, "userId", tokenData.id) as ExecutionResultContainer<ExecutionResult, LikeResponse>;

        if (findLike.executionStatus !== ExecutionResult.Pass) {
            return new ExecutionResultContainer(UserServiceExecutionResult.DataBaseFailed);
        }

        let foundLike = findLike.executionResultObject;
        let resultLikeData: LikeResponse;

        if (!foundLike) {
            let saveData = new LikeDataBase(tokenData.id, likeData);
            let saveNewLike = await this.db.SetOne(this.likeTable, saveData) as ExecutionResultContainer<ExecutionResult, LikeResponse>;

            if (saveNewLike.executionStatus !== ExecutionResult.Pass || !saveNewLike.executionResultObject) {
                return new ExecutionResultContainer(UserServiceExecutionResult.DataBaseFailed);
            }

            resultLikeData = saveNewLike.executionResultObject;
        }
        else if (foundLike.status !== likeData.status) {
            let updateExistedLike = await this.db.UpdateOne(this.likeTable, foundLike.id, likeData) as ExecutionResultContainer<ExecutionResult, LikeResponse>;
            if (updateExistedLike.executionStatus !== ExecutionResult.Pass || !updateExistedLike.executionResultObject) {
                return new ExecutionResultContainer(UserServiceExecutionResult.DataBaseFailed);
            }

            resultLikeData = updateExistedLike.executionResultObject;
        }
        else {
            resultLikeData = foundLike;
        }

        return new ExecutionResultContainer(UserServiceExecutionResult.Success, resultLikeData);
    }

}

export const likeService = new LikeService(mongoDb, tokenHandler);