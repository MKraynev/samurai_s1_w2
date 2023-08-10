import express from "express";
import { blogRouter } from "./_legacy/Routes/Blogs/BlogRouter";
import { postRouter } from "./_legacy/Routes/Posts/PostRouter";
import { _TestClearAllRouter } from "./_legacy/Routes/ClearAllRepo/clearAll";
import { RunDB } from "./_legacy/Repos/DB/MongoDB/MongoDbHandler";


export const BlogsPath = "/blogs";
export const PostsPath = "/posts";
export const TestClearAllPath = "/testing/all-data";

export const app = express();

app.use(express.json());
app.use(BlogsPath, blogRouter);
app.use(PostsPath, postRouter);
app.use(TestClearAllPath, _TestClearAllRouter);

const PORT: number = 5001;
const StartApp = async () => {
    await RunDB();
    app.listen(PORT, () => {
        console.log("app start");
    })    
} 

StartApp();




