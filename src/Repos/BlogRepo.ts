import { ObjectId } from "mongodb";
import { _blogCollection } from "./DB/MongoDB/MongoDbHandler";
import { RequestBlogData, ResponseBlogData } from "./Entities/Blog";
import { IRepo } from "./Interfaces/IRepo";


class BlogRepo implements IRepo<RequestBlogData>{
    async take(id: string): Promise<ResponseBlogData | null> {
        try {
            let foundedValue = await _blogCollection.findOne({ "_id": new ObjectId(id) })
            if (foundedValue)
                return new ResponseBlogData(foundedValue._id, foundedValue);
        }
        catch {

        }
        return null;
    }

    async takeAll(): Promise<ResponseBlogData[]> {
        let blogs: ResponseBlogData[] = [];
        try {
            let foundedValues = await _blogCollection.find({}).toArray();
            if (foundedValues) {
                foundedValues.forEach(rawBlog => {
                    blogs.push(new ResponseBlogData(rawBlog._id, rawBlog))
                })
            }
        }
        catch {
        }
        return blogs;

    }

    async add(element: RequestBlogData): Promise<ResponseBlogData | null> {
        try {
            let addResult = await _blogCollection.insertOne(element);
            if (addResult.acknowledged) {
                return new ResponseBlogData(addResult.insertedId, element);
            }
        }
        catch {
        }
        return null;
    }

    async update(id: string, elementData: RequestBlogData): Promise<boolean> {
        try {
            let updateResult = await _blogCollection.updateOne({ _id: new ObjectId(id) }, { elementData })
            return updateResult.matchedCount === 1;
        }
        catch {
        }
        return false;
    }

    async delete(id: string): Promise<boolean> {
        try {
            let delResult = await _blogCollection.deleteOne({ _id: new ObjectId(id) })
            return delResult.acknowledged;
        }
        catch {
            return false;
        }
    }

    async __clear__(): Promise<boolean> {
        try {
            let delResult = await _blogCollection.deleteMany({})
            return delResult.acknowledged;
        }
        catch {
            return false;
        }
    }
}

export const _BlogRepo = new BlogRepo();