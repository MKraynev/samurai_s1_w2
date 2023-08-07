import { Post } from "./Entities/Post";
import { IRepo } from "./Interfaces/IRepo";

class PostRepo implements IRepo<Post>{
    async take(id?: string): Promise<Post | Post[] | null> {
        throw new Error("Method not implemented.");
    }
    async add(element: Post): Promise<Post | null> {
        throw new Error("Method not implemented.");
    }
    async update(id: string, elementData: Post): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async __clear__(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    
}

export const _PostRepo = new PostRepo();