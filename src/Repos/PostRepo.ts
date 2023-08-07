import { ObjectId } from "mongodb";
import { _postCollection } from "./DB/MongoDB/MongoDbHandler";
import { RequestPostData, ResponsePostData } from "./Entities/Post";
import { IRepo } from "./Interfaces/IRepo";

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
            let addResult = await _postCollection.insertOne(element);
            if (addResult.acknowledged) {
                return new ResponsePostData(addResult.insertedId, element);
            }
        }
        catch {
        }
        return null;
    }
    async update(id: string, elementData: RequestPostData): Promise<boolean> {
        try {
            let updateResult = await _postCollection.updateOne({ _id: new ObjectId(id) }, { elementData })
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