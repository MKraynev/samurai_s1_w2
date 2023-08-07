import { Blog } from "./Entities/Blog";
import { IRepo } from "./Interfaces/IRepo";

class BlogRepo implements IRepo<Blog>{
    async take(id?: string): Promise<Blog | Blog[] | null> {
        throw new Error("Method not implemented.");
    }
    async add(element: Blog): Promise<Blog | null> {
        throw new Error("Method not implemented.");
    }
    async update(id: string, elementData: Blog): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async __clear__(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    
}

export const _BlogRepo = new BlogRepo();