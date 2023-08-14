import { BlogRequest } from "../../../1_PresentationLayer/_Classes/Data/BlogForRequest";
import { PostRequest } from "../../../1_PresentationLayer/_Classes/Data/PostForRequest";

export class PostDataBase extends PostRequest {
    constructor(
        post: PostRequest,
        public createdAt: string = (new Date()).toISOString()
    ) {
        super(post.title, post.shortDescription, post.content, post.blogId, post.blogName)
    }
}