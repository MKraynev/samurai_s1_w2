import { IRepo } from "../IRepo";

export class Blog {
    constructor(
        public name: string = "",
        public description: string = "",
        public websiteUrl: string = ""
    ) { }
}

class NumberedBlog extends Blog{
    constructor(readonly id:number, blog: Blog){
        super(blog.name, blog.description, blog.websiteUrl)
    }
}


class BlogRepo implements IRepo<NumberedBlog>{
    _counter: number = 1;
    private _blogs: NumberedBlog[] = [];

    constructor(blogs: Blog[]) {
        blogs.forEach(blog => this.add(blog));
    }

    take(id?: number | undefined): NumberedBlog | NumberedBlog[] | null {

        if (id !== undefined) {
            let foundedBlog = this._blogs.find(blog => blog.id === id)
            return foundedBlog || null;
        }

        return this._blogs;
    }

    add(element: Blog): NumberedBlog | null {
        
        let newNumberedBlog = new NumberedBlog(this._counter++, element);
        this._blogs.push(newNumberedBlog);
        return newNumberedBlog;
    }

    update(id: number, elementData: Blog): boolean {
        let blogIndex = this._blogs.findIndex(blog => blog.id === id)
        if (blogIndex === -1) return false;

        this._blogs[blogIndex] = new NumberedBlog(id, elementData);
        return true;
    }

    delete(id: number): boolean {
        let blogIndex = this._blogs.findIndex(blog => blog.id === id)

        if (!blogIndex) return false;
        this._blogs.splice(blogIndex, 1);
        return true;
    }

}

let blogs = [
    new Blog("Jamie Oliver", "How to cook fast and delicious", "www.jamoli.com"),
    new Blog("Jacky Chan", "Kiya!", "www.chanchan.cn")
]
export const _BLOGS_ = new BlogRepo(blogs)