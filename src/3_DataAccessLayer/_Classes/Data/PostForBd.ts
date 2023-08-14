import { BlogRequest } from "../../../1_PresentationLayer/_Classes/Data/BlogForRequest";
import { PostRequest } from "../../../1_PresentationLayer/_Classes/Data/PostForRequest";

export class PostDataBase extends PostRequest {
    constructor(
        post: PostRequest,
        blogName: string = "",
        createAt: string = (new Date()).toISOString()
    ) {
        super(post.title, post.shortDescription, post.content, post.blogId)
    }
}