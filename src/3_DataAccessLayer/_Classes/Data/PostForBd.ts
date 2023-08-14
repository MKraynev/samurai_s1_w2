import { BlogRequest } from "../../../1_PresentationLayer/_Classes/Data/BlogForRequest";
import { PostRequest } from "../../../1_PresentationLayer/_Classes/Data/PostForRequest";

export class PostDataBase extends PostRequest {
    constructor(
        post: PostRequest,
        public createAt: string = (new Date()).toISOString(),
        public blogName: string = ""
    ) {
        super(post.title, post.shortDescription, post.content, post.blogId)
    }
}