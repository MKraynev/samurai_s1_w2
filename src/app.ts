import express from "express";

import { blogRouter } from "./1_PresentationLayer/BlogRouter/NewBlogsRouter";
import { dataManager } from "./2_BusinessLogicLayer/_Classes/DataManager";
import { _NewTestClearAllRouter } from "./1_PresentationLayer/TestRouter/NewTestRouter";
import { postRouter } from "./1_PresentationLayer/PostRouter/NewPostsRouter";
import { userRouter } from "./1_PresentationLayer/UserRouter/UserRouter";
import { authRouter } from "./1_PresentationLayer/AuthRouter/AuthRouter";
import { commentRouter } from "./1_PresentationLayer/Comments/CommentsRoutine";

export const BlogsPath = "/blogs";
export const PostsPath = "/posts";
export const UsersPath = "/users";
export const authPath = "/auth";
export const commentPath = "/comments";

export const TestClearAllPath = "/testing/all-data";

export const app = express();
app.use(express.json());

app.use(BlogsPath, blogRouter);
app.use(PostsPath, postRouter);
app.use(UsersPath, userRouter);
app.use(authPath, authRouter);
app.use(commentPath, commentRouter);

app.use(TestClearAllPath, _NewTestClearAllRouter)

const PORT: number = 5001;
const StartApp = async () => {

    if(await dataManager.Run()){
        console.log("db is running")
    }


    app.listen(PORT, () => {
        console.log("app is running");
    })
}

StartApp();