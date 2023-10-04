import { AvailableLikeStatus } from "../../Likes/Entities/LikeRequest";
import { CommentDataBase } from "./CommentForDataBase";
import { CommentResponse } from "./CommentForResponse";

export type LikesInfo = {
    likesCount: number,
    dislikesCount: number,
    myStatus: AvailableLikeStatus
}

export class CommentResponseExtended extends CommentDataBase{
    public likesInfo: LikesInfo;
    constructor(commentData: CommentResponse, likeInfo: LikesInfo) {
        super(commentData, commentData.postId, commentData.commentatorInfo.userLogin, commentData.commentatorInfo.userId, commentData.createdAt)
        this.likesInfo = likeInfo;
    }
}