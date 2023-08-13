import { Db, MongoClient, ObjectId, Sort, SortDirection } from "mongodb";
import { DataBase } from "../_Classes/DataBase/DataBase";
import dotenv from "dotenv"
import { Sorter } from "../_Classes/DataManagment/Sorter";
import { PageHandler } from "../_Classes/DataManagment/PageHandler";
import { BlogSorter } from "../Blogs/BlogSorter";
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

    async GetContaining(tableName: string, key: string, containingValue: string): Promise<any[] | null> {
        return (await this._db.collection(tableName).find({ key: { $regex: containingValue } }).toArray());
    }



    async GetAll(tableName: string, sorter: BlogSorter, pageHandler: PageHandler): Promise<any[] | null> {
        let collectionSize = await this.GetSize(tableName);
        let searchPattert = this.BuildMobgoSearcher(sorter);
        let mongoSorter = this.BuildMongoSorter(sorter);
        let skipVal = this.FindSkip(collectionSize, pageHandler.pageSize, pageHandler.pageNumber);

        return (await this._db.collection(tableName)
            .find(searchPattert)
            .sort(mongoSorter)
            .skip(skipVal)
            .limit(pageHandler.pageSize)
            .toArray());
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

    private BuildMongoSorter(sorter: BlogSorter): Sort {
        let sortName = sorter.sortBy;
        let sortDir: SortDirection = sorter.sortDirection;

        let mongoSorter: Sort = {};
        mongoSorter[sortName] = sortDir;
        return mongoSorter;
    }

    private BuildMobgoSearcher(sorter: BlogSorter): MongoSearch {
        if (sorter.searchNameTerm) {
            let searcher: MongoSearch = {
                "name": { $regex: sorter.searchNameTerm }
            }
            return searcher;
        }
        return {};
    }
    private async GetSize(tableName: string): Promise<number> {
        return await this._db.collection(tableName).count();
    }
    private FindSkip(totalCount: number, pageSize: number, pageNum: number): number {
        if (totalCount > pageSize) {
            let maxPages = Math.ceil(totalCount / pageSize);
            let availableSkipPages = Math.min(maxPages, pageNum) - 1;
            return availableSkipPages * pageSize;

        }
        return 0;

    }
}

const dbUrl = process.env.MONGO_URL || "";

export const mongoDb = new MongoDb(dbUrl, "s1w3");
