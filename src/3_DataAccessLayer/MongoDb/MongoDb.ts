import { Db, MongoClient, ObjectId } from "mongodb";
import { DataBase } from "../_Classes/DataBase/DataBase";
import dotenv from "dotenv"
dotenv.config();

class MongoDb extends DataBase{
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
        let internalId = new ObjectId(id);
        return this._db.collection(tableName).findOne({_id: internalId});
        
    }

    async GetContaining(tableName: string, key: string, containingValue: string): Promise<any[] | null> {
        return (await this._db.collection(tableName).find({key: {$regex: containingValue}}).toArray());
    }

       

    async GetAll(tableName: string): Promise<any[] | null> {
        return (await this._db.collection(tableName).find({}).toArray());
    }
    
    async RunDb(): Promise<boolean> {
        if(this._dbIsRunning){
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
}

const dbUrl = process.env.MONGO_URL || "";

export const mongoDb = new MongoDb(dbUrl, "s1w3");