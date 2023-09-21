import express from "express";
import { blogRouter } from "./Entities/Blogs/Router/BlogsRouter";
import { _NewTestClearAllRouter } from "./Entities/ClearAll/Router/TestRouter";
import { postRouter } from "./Entities/Posts/Router/PostsRouter";
import { userRouter } from "./Entities/Users/Admin/Router/UserRouter";
import { commentRouter } from "./Entities/Comments/Router/CommentsRouter";
import cookieParser from "cookie-parser";
import ngrok from "ngrok"
import { PORT_NUM } from "./settings";
import { mongoDb } from "./Common/Database/MongoDb";
import { authRouter } from "./Entities/Users/Common/Router/AuthRouter";

export const BlogsPath = "/blogs";
export const PostsPath = "/posts";
export const UsersPath = "/users";
export const authPath = "/auth";
export const commentPath = "/comments";

export const TestClearAllPath = "/testing/all-data";

export const app = express();
app.use(express.json());
app.use(cookieParser())

app.use(BlogsPath, blogRouter);
app.use(PostsPath, postRouter);
app.use(UsersPath, userRouter);
app.use(authPath, authRouter);
app.use(commentPath, commentRouter);
app.use(TestClearAllPath, _NewTestClearAllRouter)

// app.use(async (err, req, res, next) => {

// })

const PORT: number = PORT_NUM;
const ngrokConnect = async (): Promise<string> => {
    const url = await ngrok.connect();
    console.log(url);
    return url;
};

const StartApp = async () => {

    // if (await dataManager.Run()) {
    //     console.log("db is running")
    // }
    await mongoDb.RunDb();

    app.listen(PORT, () => {
        console.log("app is running");
    })

    //await ngrokConnect();
}

StartApp();

