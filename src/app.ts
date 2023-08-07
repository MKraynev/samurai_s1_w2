import express from "express";
import { blogRouter } from "./Routes/Blogs/BlogRouter";
import { postRouter } from "./Routes/Posts/PostRouter";
import { _TestClearAllRouter } from "./Routes/ClearAllRepo/clearAll";
import { RunDB } from "./Repos/DB/MongoDB/MongoDbHandler";

const PORT: number = 5001;
export const BlogsPath = "/blogs";
export const PostsPath = "/posts";
export const TestClearAllPath = "/testing/all-data";

export const app = express();

app.use(express.json());
app.use(BlogsPath, blogRouter);
app.use(PostsPath, postRouter);
app.use(TestClearAllPath, _TestClearAllRouter);

const StartApp = async () => {
    await RunDB();
    app.listen(PORT, () => {
        console.log("app start");
    })    
} 

StartApp();




