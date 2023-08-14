import { Db, MongoClient, ObjectId, Sort, SortDirection } from "mongodb";
import { DataBase } from "../_Classes/DataBase/DataBase";
import dotenv from "dotenv"
import { Sorter, SorterType } from "../_Classes/DataManagment/Sorter";
import { PageHandler } from "../_Classes/DataManagment/PageHandler";
import { BlogSorter } from "../Blogs/BlogSorter";
import { ResponseBlogData } from "../../_legacy/Repos/Entities/Blog";
import { Paged } from "../_Types/Paged";
import { PostSorter } from "../Posts/PostSorter";
dotenv.config();

type MongoSearch = {
    [key: string]: { $regex: string }
}


class MongoDb extends DataBase {

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

    async GetAll(tableName: string, sorter: BlogSorter | PostSorter, pageHandler: PageHandler): Promise<[PageHandler, any]> {
        let collectionSize = await this.GetSize(tableName);
        let searchPattert = this.BuildMobgoSearcher(sorter);
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

    private BuildMongoSorter(sorter: BlogSorter | PostSorter): Sort {
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
        }

        return mongoSorter;
    }

    private BuildMobgoSearcher(sorter: BlogSorter | PostSorter): MongoSearch {
        switch (sorter.sorterType) {
            case SorterType.BlogSorter:
                sorter = sorter as BlogSorter;
                if (sorter.searchNameTerm) {
                    let searcher: MongoSearch = {
                        "name": { $regex: sorter.searchNameTerm }
                    }
                    return searcher;
                }
                return {};
                break;

            case SorterType.PostSorter:
                sorter = sorter as PostSorter;
                if (sorter.searchBlogId) {
                    let searcher: MongoSearch = {
                        "blogId": { $regex: sorter.searchBlogId }
                    }
                    return searcher;
                }
                return {}
                break;
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
        return [0, 1];

    }
}

const dbUrl = process.env.MONGO_URL || "";

export const mongoDb = new MongoDb(dbUrl, "s1w3");
