import { ObjectId } from "mongodb";
import { CommentRequest, CommentRequestForDB } from "./CommentRequest";
import { CommentDataBase, CommentatorInfo } from "./CommentForDataBase";
import { UserResponse } from "../../Users/Admin/Entities/UserForResponse";

export class CommentResponse extends CommentRequest{
    public id: string;
    public commentatorInfo: CommentatorInfo;
    public createdAt: string;

    constructor(_id: ObjectId,
        dbComment: CommentDataBase
        ) {
        super(
            dbComment.content
            );
        
            this.id = _id.toString();
            this.commentatorInfo = dbComment.commentatorInfo;
            this.createdAt = dbComment.createdAt;
    }
}