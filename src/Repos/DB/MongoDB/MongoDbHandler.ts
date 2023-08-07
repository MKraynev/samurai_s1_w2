import { MongoClient } from "mongodb";
import dotenv from "dotenv"
import { Post } from "../../Entities/Post";
import { Blog } from "../../Entities/Blog";
dotenv.config();

const dbUrl = process.env.MONGO_URL || "";

console.log(`Connect to ${dbUrl}`);
type MyType = {
    name: string,
    age: number
}
type myBlogType = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}
type myPostType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    createdAt: string,
    isMembership: boolean
}

const client = new MongoClient(dbUrl);


export const RunDB = async () => {
    try {
        await client.connect();
        console.log("Connected")
        let prom = await client.db("test").collection<MyType>('testCollection').find({}).toArray();
        console.log(prom);
    }
    catch {
        console.log("Connection failed");
        await client.close();

    }
}

const DB = client.db("s1w3");
export const _postCollection = DB.collection<myPostType>("posts");
export const _blogCollection = DB.collection<myBlogType>("blogs");