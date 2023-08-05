import { Post } from "./Entities/Post";
import { IRepo } from "./Interfaces/IRepo";

class PostRepo implements IRepo<Post>{
    take(id?: string): Promise<Post | Post[] | null> {
        throw new Error("Method not implemented.");
    }
    add(element: Post): Promise<Post | null> {
        throw new Error("Method not implemented.");
    }
    update(id: string, elementData: Post): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    __clear__(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}