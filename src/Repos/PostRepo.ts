import { ObjectId } from "mongodb";
import { _postCollection } from "./DB/MongoDB/MongoDbHandler";

import { IRepo } from "./Interfaces/IRepo";
import { RequestPostData, RequestSavePostData, ResponsePostData } from "./Entities/Post";

class PostRepo implements IRepo<RequestPostData>{
    async take(id: string): Promise<ResponsePostData | null> {
        try {
            let objIdValue = new ObjectId(id);
            let foundedValue = await _postCollection.findOne({ _id: objIdValue })
            if (foundedValue !== null) {
                return new ResponsePostData(foundedValue._id, foundedValue);
            }

        }
        catch {
            return null;
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
            });

            if (addResult.acknowledged) {
                return new ResponsePostData(addResult.insertedId, extendedPostData);
            }
        }
        catch {
        }
        return null;
    }
    async update(id: string, elementData: RequestPostData): Promise<boolean> {
        try {
            let { title, shortDescription, content, blogId } = elementData;

            let updateResult = await _postCollection.updateOne({ _id: new ObjectId(id) }, {
                $set: {
                    "title": title,
                    "shortDescription": shortDescription,
                    "content": content,
                    "blogId": blogId
                }
            })
            return updateResult.matchedCount === 1;
        }
        catch {
        }
        return false;
    }
    async delete(id: string): Promise<boolean> {
        try {
            let objIdValue = new ObjectId(id);
            let delResult = await _postCollection.deleteOne({ _id: objIdValue })
            return delResult.acknowledged;
        }
        catch {

        }
        return false;
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