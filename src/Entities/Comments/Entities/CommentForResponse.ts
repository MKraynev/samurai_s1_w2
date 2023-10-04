import { ObjectId } from "mongodb";
import { CommentDataBase, CommentatorInfo } from "./CommentForDataBase";
import { CommentResponseExtended, LikesInfo } from "./CommentResponseExtended";
import { likeService } from "../../Likes/BuisnessLogic/LikeService";
import { UserServiceExecutionResult } from "../../Users/Common/BuisnessLogic/UserService";

export class CommentResponse extends CommentDataBase {
    public id: string;

    constructor(_id: ObjectId, dbComment: CommentDataBase) {
        super(dbComment, dbComment.postId, dbComment.commentatorInfo.userLogin, dbComment.commentatorInfo.userId, dbComment.createdAt);
        this.id = _id.toString();
    }

    public async UpgradeToExtended(): Promise<CommentResponseExtended> {
        let likeInfo: LikesInfo = {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: "None"
        }

        let getLikeStatistic = await likeService.Count(this.id);
        if (getLikeStatistic.executionStatus === UserServiceExecutionResult.Success && getLikeStatistic.executionResultObject) {
            let likeData = getLikeStatistic.executionResultObject;
            likeInfo.dislikesCount = likeData.dislikes;
            likeInfo.likesCount = likeData.likes;
        }
        let result = new CommentResponseExtended(this, likeInfo)

        return result;
    }
}