import { ObjectId } from "mongodb";
import { _postCollection } from "./DB/MongoDB/MongoDbHandler";

import { IRepo } from "./Interfaces/IRepo";
import { RequestPostData, RequestSavePostData, ResponsePostData } from "./Entities/Post";

class PostRepo implements IRepo<RequestPostData>{
    async take(id: string | undefined): Promise<ResponsePostData | null> {
        try {
            let foundedValue = await _postCollection.findOne({ "_id": new ObjectId(id) })
            if (foundedValue)
                return new ResponsePostData(foundedValue._id, foundedValue);
        }
        catch {

        }
        return null;
    }
    async takeAll(): Promise<RequestPostData[]> {
        let posts: ResponsePostData[] = [];
        try {
            let foundedValues = await _postCollection.find({}).toArray();
            if (foundedValues) {
                foundedValues.forEach(rawBlog => {
                    posts.push(new ResponsePostData(rawBlog._id, rawBlog))
                })
            }
        }
        catch {
        }
        return posts;
    }
    async add(element: RequestPostData): Promise<ResponsePostData | null> {
        try {
            let extendedPostData = new RequestSavePostData(element);
            let addResult = await _postCollection.insertOne({
                ...extendedPostData,
                createdAt: (new Date()).toISOString()
            });
            
            if (addResult.acknowledged) {
                //return new ResponsePostData(addResult.insertedId, extendedPostData);
                return await this.take((addResult.insertedId).toString())
            }
        }
        catch {
        }
        return null;
    }
    async update(id: string, elementData: RequestPostData): Promise<boolean> {
        try {
            let updateResult = await _postCollection.updateOne({ _id: new ObjectId(id) }, { $set: {elementData} })
            return updateResult.matchedCount === 1;
        }
        catch {
        }
        return false;
    }
    async delete(id: string): Promise<boolean> {
        try {
            let delResult = await _postCollection.deleteOne({ _id: new ObjectId(id) })
            return delResult.acknowledged;
        }
        catch {
            return false;
        }
    }
    async __clear__(): Promise<boolean> {
        try {
            let delResult = await _postCollection.deleteMany({})
            return delResult.acknowledged;
        }
        catch {
            return false;
        }
    }
}


export const _PostRepo = new PostRepo();