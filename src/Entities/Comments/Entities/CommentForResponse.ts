import { ObjectId } from "mongodb";
import { CommentRequest, CommentRequestForDB } from "./CommentRequest";
import { CommentDataBase, CommentatorInfo } from "./CommentForDataBase";
import { UserResponse } from "../../Users/Admin/Entities/UserForResponse";

export class CommentResponse extends CommentDataBase {
    public id: string;

    constructor(_id: ObjectId, dbComment: CommentDataBase) {
        super(dbComment, dbComment.postId, dbComment.commentatorInfo.userLogin, dbComment.commentatorInfo.userId, dbComment.createdAt);
        this.id = _id.toString();
    }
}