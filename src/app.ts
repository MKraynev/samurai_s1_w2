import express from "express";
import { blogRouter } from "./Routes/Blogs/BlogRouter";
import { _TestClearAllRouter } from "./Routes/ClearAllRepo/clearAll";
import { clear } from "console";

export const app = express();
const PORT: number = 5001;

export const BlogsPath = "/blogs";
export const TestClearAllPath = "/testing/all-data";

app.use(express.json());

app.use(BlogsPath, blogRouter);
app.use(TestClearAllPath, _TestClearAllRouter);


app.listen(PORT, () => {
    console.log("app start");
})