import { ObjectId } from "mongodb";
import { CommentRequest, CommentRequestForDB } from "../../../1_PresentationLayer/_Classes/Data/CommentRequest";
import { CommentDataBase, CommentatorInfo } from "../../../3_DataAccessLayer/_Classes/Data/CommentDB";
import { UserResponse } from "./UserForResponse";

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