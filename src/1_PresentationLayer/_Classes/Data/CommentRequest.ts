import { UserResponse } from "../../../2_BusinessLogicLayer/_Classes/Data/UserForResponse";

export class CommentRequest{
    constructor(public content: string) {}
}
export class CommentRequestForDB extends CommentRequest{
    public userLogin: string;
    public userId: string;
    public PostId: string;
    constructor(reqComment: CommentRequest, postId: string,  userId: string, userLogin:string) {
        super(reqComment.content);
        this.userLogin = userLogin;
        this.userId = userId;
        this.PostId = postId;
    }
}