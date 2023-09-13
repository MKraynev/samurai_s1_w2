import { Db, MongoClient, ObjectId, Sort, SortDirection } from "mongodb";
import { DataBase } from "./DataBase";
import { SorterType } from "../Repo/Sort/Sorter";
import { PageHandler } from "../Repo/Paginator/PageHandler";
import { BlogSorter } from "../../../Entities/Blogs/Repo/BlogSorter";
import { PostSorter } from "../../../Entities/Posts/Repo/PostSorter";
import { UserSorter } from "../../../Entities/Users/Repo/UserSorter";
import { MONGO_URL } from "../../../settings";
import { CommentSorter } from "../../../Entities/Comments/Repo/CommentSorter";
import { app } from "../../../app";


type MongoSearch = {
    [key: string]: { $regex: string, $options: string }
}


class MongoDb extends DataBase {


    async FindBetweenTwoProp(tableName: string, propName_1: string, propName_2: string, propVal: string): Promise<any> {
        try {
            let query_1: any = {}
            query_1[propName_1] = propVal;
            let query_2: any = {}
            query_2[propName_2] = propVal;

            return await this._db.collection(tableName).findOne({ $or: [query_1, query_2] });
        }
        catch {
            return null;
        }

    }


    private _dbIsRunning = false;
    private _client: MongoClient;
    private _db: Db;

    constructor(private url: string, private DbName: string) {
        super();

        //1 Init Db
        this._client = new MongoClient(url);
        this._db = this._client.db(DbName);
    }

    async GetById(tableName: string, id: string): Promise<any | null> {
        try {
            let internalId = new ObjectId(id);
            return await this._db.collection(tableName).findOne({ _id: internalId });
        }
        catch {
            return null;
        }

    }

    async Count(tableName: string, sorter: BlogSorter | PostSorter | UserSorter): Promise<number> {
        let searchPattert = this.BuildMongoSearcher(sorter);
        let collectionSize = await this._db.collection(tableName).countDocuments(searchPattert);
        return collectionSize;
    }
    async GetByPropName(tableName: string, propName: string, propVal: string): Promise<any | null> {
        try {
            let query: any = {}
            query[propName] = propVal;
            return await this._db.collection(tableName).findOne(query);
        }
        catch {
            return null;
        }
    }

    async GetAll(tableName: string, sorter: BlogSorter | PostSorter | UserSorter, pageHandler: PageHandler): Promise<[PageHandler, any]> {

        let collectionSize = await this.Count(tableName, sorter);

        let searchPattert = this.BuildMongoSearcher(sorter);

        let mongoSorter = this.BuildMongoSorter(sorter);

        let [skipVal, maxPages, skipedPages] = this.FindSkip(collectionSize, pageHandler.pageSize, pageHandler.pageNumber);

        pageHandler.pagesCount = maxPages;
        pageHandler.page = skipedPages + 1;
        pageHandler.totalCount = collectionSize;

        let dbVal = await this._db.collection(tableName)
            .find(searchPattert)
            .sort(mongoSorter)
            .skip(skipVal)
            .limit(pageHandler.pageSize)
            .toArray();
        return [pageHandler, dbVal];
    }

    async Post(tableName: string, obj: any): Promise<any | null> {
        try {
            let postResult = await this._db.collection(tableName).insertOne(obj);
            return {
                id: postResult.insertedId.toString(),
                ...obj
            }
        }
        catch {
            return null;
        }
    }

    async Put(tableName: string, id: string, obj: any): Promise<any | null> {
        try {
            let updateResult = await this._db
                .collection(tableName)
                .updateOne({ _id: new ObjectId(id) }, { $set: obj })


            if (updateResult.matchedCount === 1) {
                let updatedValue = await this.GetById(tableName, id);
                return updatedValue;
            }
            return null;
        }
        catch {
            return null;
        }
    }

    async PutProp(tableName: string, id: string, property: string, value: string | boolean | number): Promise<any> {
        try {
            let updateField: any = {};
            updateField[property] = value;

            let updateResult = await this._db.collection(tableName).updateOne({ _id: new ObjectId(id) }, { $set: updateField })

            if (updateResult.matchedCount == 1) {
                let updatedValue = await this.GetById(tableName, id);
                return updatedValue;
            }
            return null;
        }
        catch {
            return null;
        }
    }
    async PushProp(tableName: string, id: string, property: string, value: string | boolean | number): Promise<boolean> {
        try {
            let updateField: any = {};
            updateField[property] = value;

            let appendRes = await this._db.collection(tableName).updateOne({ _id: new ObjectId(id) }, { $push: updateField })
            return appendRes.matchedCount == 1;
        }
        catch {
            return false;
        }
    }
    async Delete(tableName: string, id: string): Promise<boolean> {
        try {
            let dbId = new ObjectId(id);
            let deleteResult = await this._db.collection(tableName).deleteOne({ _id: dbId })
            return deleteResult.deletedCount === 1;
        }
        catch {
            return false;
        }
    }

    async DeleteAll(tableName: string): Promise<boolean> {
        try {
            let delRes = await this._db.collection(tableName).deleteMany({});
            return delRes.acknowledged;
            //return await this._db.dropCollection(tableName);

        }
        catch {
            return false;
        }
    }


    async RunDb(): Promise<boolean> {
        if (this._dbIsRunning) {
            return true;
        }
        try {
            await this._client.connect();
            console.log("Connected")
            this._dbIsRunning = true;
            return this._dbIsRunning;

        }
        catch {
            console.log("Connection failed");
            await this._client.close();
            this._dbIsRunning = false;
            return this._dbIsRunning;
        }
    }

    private BuildMongoSorter(sorter: BlogSorter | PostSorter | UserSorter | CommentSorter): Sort {
        let sortDir: SortDirection = sorter.sortDirection;
        let mongoSorter: Sort = {};

        switch (sorter.sorterType) {
            case SorterType.BlogSorter:
                sorter = sorter as BlogSorter;
                mongoSorter[sorter.sortBy] = sortDir;
                break;

            case SorterType.PostSorter:
                sorter = sorter as PostSorter;
                mongoSorter[sorter.sortBy] = sortDir;

                break;
            case SorterType.UserSorter:
                sorter = sorter as UserSorter;
                mongoSorter[sorter.sortBy] = sortDir;
                break;

            case SorterType.CommentSorter:
                sorter = sorter as CommentSorter;
                mongoSorter[sorter.sortBy] = sortDir;
                break;
        }

        return mongoSorter;
    }

    private BuildMongoSearcher(sorter: BlogSorter | PostSorter | UserSorter | CommentSorter): MongoSearch {
        switch (sorter.sorterType) {
            case SorterType.BlogSorter:
                sorter = sorter as BlogSorter;
                if (sorter.searchNameTerm) {
                    let searcher: MongoSearch = {
                        "name": { $regex: sorter.searchNameTerm, $options: 'i' }
                    }

                    return searcher;
                }
                return {};
                break;

            case SorterType.PostSorter:
                sorter = sorter as PostSorter;
                if (sorter.searchBlogId) {
                    let searcher: MongoSearch = {
                        "blogId": { $regex: sorter.searchBlogId, $options: 'i' }
                    }
                    return searcher;
                }
                return {}
                break;

            case SorterType.UserSorter:
                sorter = sorter as UserSorter;
                if (sorter.searchEmailTerm && sorter.searchLoginTerm) {
                    let searcher: any = {
                        "$or": [
                            { "email": { $regex: sorter.searchEmailTerm, $options: 'i' } },
                            { "login": { $regex: sorter.searchLoginTerm, $options: 'i' } }
                        ]
                    }
                    return searcher;
                }
                else if (sorter.searchEmailTerm) {
                    let searcher: MongoSearch = {
                        "email": { $regex: sorter.searchEmailTerm, $options: 'i' }
                    }
                    return searcher;
                }
                else if (sorter.searchLoginTerm) {
                    let searcher: MongoSearch = {
                        "login": { $regex: sorter.searchLoginTerm, $options: 'i' }
                    }
                    return searcher;
                }
                return {}
            case SorterType.CommentSorter:
                sorter = sorter as CommentSorter;
                if (sorter.postId) {
                    let searcher: MongoSearch = {
                        "postId": { $regex: sorter.postId, $options: 'i' }
                    }
                    return searcher;
                }
                return {}
        }
    }

    private async GetSize(tableName: string): Promise<number> {
        return await this._db.collection(tableName).count();
    }
    private FindSkip(totalCount: number, pageSize: number, pageNum: number): number[] {
        if (totalCount > pageSize) {
            let maxPages = Math.ceil(totalCount / pageSize);
            let availableSkipPages = Math.min(maxPages, pageNum) - 1;

            return [availableSkipPages * pageSize, maxPages, availableSkipPages];


        }
        return [0, 1, 0];

    }
}

const dbUrl = MONGO_URL;

export const mongoDb = new MongoDb(dbUrl, "s2w2");
