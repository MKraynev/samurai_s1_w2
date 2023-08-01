import { IRepo } from "../IRepo";

export class PostData {
    constructor(
        public title: string = "",
        public shortDescription: string = "",
        public content: string = "",
        public blogId: string = ""
    ) { }
}

class PostWithExtendedData extends PostData{
    constructor(readonly id:string, readonly blogName : string, post: PostData){
        super(post.title, post.shortDescription, post.content, post.blogId)
    }
}


class PostRepo implements IRepo<PostWithExtendedData>{
    _counter: number = 1;
    _blogName: string = "DefaultBlogName";
    private _posts: PostWithExtendedData[] = [];

    constructor(posts: PostData[]) {
        posts.forEach(blog => this.add(blog));
    }

    take(id?: string): PostWithExtendedData | PostWithExtendedData[] | null {
        if (id) {
            let foundedBlog = this._posts.find(blog => blog.id === id)
            return foundedBlog || null;
        }

        return this._posts;
    }

    add(element: PostData): PostWithExtendedData | null {
        
        let newExtendedPost = new PostWithExtendedData((this._counter++).toString(), 
        this._blogName,
        element);

        this._posts.push(newExtendedPost);
        return newExtendedPost;
    }

    update(id: string, elementData: PostData): boolean {
        let postIndex = this._posts.findIndex(blog => blog.id === id)
        if (postIndex === -1) return false;

        this._posts[postIndex] = new PostWithExtendedData(id, this._blogName, elementData);
        return true;
    }

    delete(id: string): boolean {
        let postIndex = this._posts.findIndex(post => post.id === id)

        if (postIndex === -1) return false;
        this._posts.splice(postIndex, 1);
        return true;
    }

    __clear__(): void {
        this._posts = [];
    }
}

let posts = [
    new PostData("Бесконечность не предел", "космос", "бла бла бла бла бла", "12S_43F"),
    new PostData("Кухни мира", "еда", "бла бла бла бла бла бла", "54M_06K")
]
export const _PostRepo = new PostRepo(posts)