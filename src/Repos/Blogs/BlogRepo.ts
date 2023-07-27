import { IRepo } from "../IRepo";

class Blog {
    public id: number =1;

    constructor(
        public name: string,
        public descriptin: string,
        public websiteUrl: string
    ) {}
}

class BlogRepo implements IRepo<Blog>{
    _counter:number = 1;
    private _blogs: Blog[] = [];

    constructor(blogs: Blog[]) {
        blogs.forEach(blog => this.add(blog));
    }

    take(id?: number | undefined): Blog | Blog[] | null {

        if (id !== undefined) {
            let foundedBlog = this._blogs.find(blog => blog.id === id)
            return foundedBlog || null;
        }

        return this._blogs;
    }

    add(element: Blog): Blog {
        element.id = this._counter++;
        this._blogs.push(element);
        return element;
    }

    update(id: number, elementData: Blog): boolean {
        let blogIndex = this._blogs.findIndex(blog => blog.id === id)
        
        if(!blogIndex) return false;

        elementData.id = id;
        this._blogs[blogIndex] = elementData;
        return true;
    }

    delete(id: number): boolean {
        let blogIndex = this._blogs.findIndex(blog => blog.id === id)
        
        if(!blogIndex) return false;
        this._blogs.splice(blogIndex, 1);
        return true;
    }

}

let blogs = [
    new Blog("Jamie Oliver", "How to cook fast and delicious", "www.jamoli.com"),
    new Blog("Jacky Chan", "Kiya!", "www.chanchan.cn"),
    new Blog("", "How to cook fast and delicious", "www.jamoli.com"),
]
export const _BLOGS_= new BlogRepo(blogs)