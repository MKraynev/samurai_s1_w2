import { ObjectId } from "mongodb";
import { _blogCollection } from "./DB/MongoDB/MongoDbHandler";
import { RequestBlogData, RequestSaveBlogData, ResponseBlogData } from "./Entities/Blog";
import { IRepo } from "./Interfaces/IRepo";


class BlogRepo implements IRepo<RequestBlogData>{
    async take(id: string): Promise<ResponseBlogData | null> {
        try {
            let objIdValue = new ObjectId(id);
            let foundedValue = await _blogCollection.findOne({ _id:  objIdValue})
            if (foundedValue !== null) {
                return new ResponseBlogData(foundedValue._id, foundedValue);
            }

        }
        catch {
            return null;
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

    async add(element: RequestSaveBlogData): Promise<ResponseBlogData | null> {
        try {
            let extendedBlogData = new RequestSaveBlogData(element);

            let addResult = await _blogCollection.insertOne({
                ...extendedBlogData,
            });

            return new ResponseBlogData(addResult.insertedId, extendedBlogData);
            //return await this.take((addResult.insertedId).toString())

        }
        catch {
        }
        return null;
    }

    async update(id: string, elementData: RequestBlogData): Promise<boolean> {
        try {
            let { name, description, websiteUrl } = elementData;
            let updateResult = await _blogCollection.updateOne({ _id: new ObjectId(id) }, {
                $set: {
                    "name": name,
                    "description": description,
                    "websiteUrl": websiteUrl
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
            let delResult = await _blogCollection.deleteOne({ _id: objIdValue })
            return delResult.acknowledged;
        }
        catch {
        }
        return false;
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