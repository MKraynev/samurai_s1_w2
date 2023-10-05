import { ObjectId } from "mongodb";
import { CommentDataBase, CommentatorInfo } from "./CommentForDataBase";
import { LikeStatistic } from "../../Likes/Entities/LikeStatistic";

// export class CommentResponse extends CommentDataBase {
//     public id: string;

//     constructor(_id: ObjectId, dbComment: CommentDataBase) {
//         super(dbComment, dbComment.postId, dbComment.commentatorInfo.userLogin, dbComment.commentatorInfo.userId, dbComment.createdAt);
//         this.id = _id.toString();
//         this.likesInfo = dbComment.likesInfo;
//     }
// }

export class CommentResponse {
    public id: string;
    public likesInfo: LikeStatistic;
    readonly commentatorInfo: CommentatorInfo;
    public createdAt: string;
    public content: string;

    constructor(_id: ObjectId, dbComment: CommentDataBase) {
        this.id = _id.toString();
        this.likesInfo = dbComment.likesInfo;
        this.commentatorInfo = dbComment.commentatorInfo;
        this.createdAt = dbComment.createdAt;
        this.content = dbComment.content;
    }
    
}