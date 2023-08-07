import { _postCollection } from "./DB/MongoDB/MongoDbHandler";
import { Post } from "./Entities/Post";
import { IRepo } from "./Interfaces/IRepo";

class PostRepo implements IRepo<Post>{
    private _idCounter = 1;

    async take(id?: string): Promise<Post | Post[] | null> {
        let foundedValue;
        //, { projection: { _id: false } }
        if(id){
            foundedValue = await _postCollection.findOne({id : id}, { projection: { _id: false } })
        }
        else{
            foundedValue = await _postCollection.find({}, { projection: { _id: false } }).toArray();
        }

        if(foundedValue){
            return foundedValue;
        }
        return null;
        
    }
    async add(element: Post): Promise<Post | null> {
        let newPost = 
        {
            ...new Post(), 
            id: (this._idCounter++).toString(),
            ...element,
            createdAt: (new Date()).toISOString()
        }

        let addResult = await _postCollection.insertOne(newPost);
        if(addResult.acknowledged){
            return newPost;
        }
        return null;
    }
    async update(id: string, elementData: Post): Promise<boolean> {
        let updateResult = await _postCollection.updateOne({id : id}, {$set : {elementData}})
        return updateResult.matchedCount === 1;
    }
    async delete(id: string): Promise<boolean> {
        let delResult = await _postCollection.deleteOne({id: id})
        return delResult.acknowledged;
    }

    async __clear__(): Promise<boolean> {
        let delResult = await _postCollection.deleteMany({})
        return delResult.acknowledged;
    }
    
}


export const _PostRepo = new PostRepo();