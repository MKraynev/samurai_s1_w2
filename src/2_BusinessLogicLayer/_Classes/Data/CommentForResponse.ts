import { ObjectId } from "mongodb";
import { CommentRequest } from "../../../1_PresentationLayer/_Classes/Data/CommentRequest";
import { CommentDataBase } from "../../../3_DataAccessLayer/_Classes/Data/CommentDB";
import { UserResponse } from "./UserForResponse";

export class CommentResponse extends CommentDataBase{
    public id: string;
    constructor(_id: ObjectId,
        dbComment: CommentDataBase
        ) {
        super(
            dbComment, 
            dbComment.commentatorInfo.userLogin, 
            dbComment.commentatorInfo.userId, 
            dbComment.createdAt);
        
            this.id = _id.toString();
    }
}