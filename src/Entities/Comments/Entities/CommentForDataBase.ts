import { CommentRequest } from "./CommentRequest";
import { UserDataBase } from "../../Users/Admin/Entities/UserForDataBase";

export type CommentatorInfo = {
    userId: string,
    userLogin: string
}

export class CommentDataBase extends CommentRequest{
    readonly commentatorInfo: CommentatorInfo;
    public postId: string;
    
    constructor(
        reqComment: CommentRequest,
        postId: string,
        userLogin: string, 
        userId: string,
        public createdAt: string = (new Date()).toISOString()) {
        super(reqComment.content);
        
        this.postId = postId;
        
        this.commentatorInfo = {
            userId: userId,
            userLogin: userLogin
        }
    }
}