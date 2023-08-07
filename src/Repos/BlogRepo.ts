import { _blogCollection } from "./DB/MongoDB/MongoDbHandler";
import { Blog } from "./Entities/Blog";
import { IRepo } from "./Interfaces/IRepo";


class BlogRepo implements IRepo<Blog>{
    private _idCounter = 1;

    async take(id?: string): Promise<Blog | Blog[] | null> {
        let foundedValue;

        if(id){
            foundedValue = await _blogCollection.findOne({id : id}),  { projection: { _id: false } };
        }
        else{
            foundedValue = await _blogCollection.find({},  { projection: { _id: false } }).toArray();
        }

        if(foundedValue){
            return foundedValue;
        }
        return null;
        
    }
    async add(element: Blog): Promise<Blog | null> {
        let newBlog = {
            id: (this._idCounter++).toString(),
            ...element,
            createdAt: (new Date()).toISOString()
        }
        let addResult = await _blogCollection.insertOne(newBlog);
        if( addResult.acknowledged){
            return newBlog
        }
        return null;
    }
    async update(id: string, elementData: Blog): Promise<boolean> {
        let updateResult = await _blogCollection.updateOne({id : id}, {$set : {elementData}})
        return updateResult.matchedCount === 1;
    }
    async delete(id: string): Promise<boolean> {
        let delResult = await _blogCollection.deleteOne({id: id})
        return delResult.acknowledged;
    }
    async __clear__(): Promise<boolean> {
        let delResult = await _blogCollection.deleteMany({})
        return delResult.acknowledged;
    }
    
}

export const _BlogRepo = new BlogRepo();