import { MongoClient } from "mongodb";
import dotenv from "dotenv"
import { Post } from "../../Entities/Post";
import { Blog } from "../../Entities/Blog";
dotenv.config();

const dbUrl = process.env.MONGO_URL || "";

console.log(`Connect to ${dbUrl}`);


const client = new MongoClient(dbUrl);


export const RunDB = async () => {
    try {
        await client.connect();
        console.log("Connected")

    }
    catch {
        console.log("Connection failed");
        await client.close();

    }
}

const DB = client.db("s1w3");
export const _postCollection = DB.collection<Post>("posts");
export const _blogCollection = DB.collection<Blog>("blogs");