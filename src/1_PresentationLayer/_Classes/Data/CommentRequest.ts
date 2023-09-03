import { UserResponse } from "../../../2_BusinessLogicLayer/_Classes/Data/UserForResponse";

export class CommentRequest{
    constructor(public content: string) {}
}
export class CommentRequestForDB extends CommentRequest{
    public userLogin: string;
    public userId: string;
    public PostId: string;
    constructor(reqComment: CommentRequest, postId: string,  user: UserResponse) {
        super(reqComment.content);
        this.userLogin = user.login;
        this.userId = user.id;
        this.PostId = postId;
    }
}