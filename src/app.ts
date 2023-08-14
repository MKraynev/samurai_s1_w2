import express from "express";
//s1w3
// import { blogRouter } from "./_legacy/Routes/BlogRouter";
// import { postRouter } from "./_legacy/Routes/PostRouter";
// import { RunDB } from "./_legacy/Repos/DB/MongoDB/MongoDbHandler";

//s1w4
import { blogRouter } from "./1_PresentationLayer/BlogRoute/NewBlogsRouter";
import { dataManager } from "./2_BusinessLogicLayer/_Classes/DataManager";
import { _NewTestClearAllRouter } from "./1_PresentationLayer/TestRoute/NewTestRouter";






export const BlogsPath = "/blogs";
export const PostsPath = "/posts";
export const TestClearAllPath = "/testing/all-data";

export const app = express();

app.use(express.json());
//version s1w3
// app.use(BlogsPath, blogRouter);
// app.use(PostsPath, postRouter);
// app.use(TestClearAllPath, _TestClearAllRouter);

//version s1w4
app.use(BlogsPath, blogRouter);
app.use(TestClearAllPath, _NewTestClearAllRouter)

const PORT: number = 5001;
const StartApp = async () => {
    //Version s1w3
    // await RunDB();

    //Version s1w4
    await dataManager.Run();


    app.listen(PORT, () => {
        console.log("app start");
    })
}

StartApp();




