import express from "express";
//s1w3
// import { blogRouter } from "./_legacy/Routes/BlogRouter";
// import { postRouter } from "./_legacy/Routes/PostRouter";
// import { RunDB } from "./_legacy/Repos/DB/MongoDB/MongoDbHandler";

//s1w4
import { blogRouter } from "./1_PresentationLayer/BlogRouter/NewBlogsRouter";
import { dataManager } from "./2_BusinessLogicLayer/_Classes/DataManager";
import { _NewTestClearAllRouter } from "./1_PresentationLayer/TestRouter/NewTestRouter";
import { postRouter } from "./1_PresentationLayer/PostRouter/NewPostsRouter";
import { userRouter } from "./1_PresentationLayer/UserRouter/UserRouter";
import { authRouter } from "./1_PresentationLayer/AuthRouter/AuthRouter";






export const BlogsPath = "/blogs";
export const PostsPath = "/posts";
export const UsersPath = "/users";
export const authPath = "/auth/login";

export const TestClearAllPath = "/testing/all-data";


export const app = express();

app.use(express.json());


app.use(BlogsPath, blogRouter);
app.use(PostsPath, postRouter);
app.use(UsersPath, userRouter);
app.use(authPath, authRouter);
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