import express from "express";
import { blogRouter } from "./Routes/Blogs/BlogRouter";

export const app = express();
const PORT: number = 5001;
export const BlogsPath = "/ht_02/api/blogs";

app.use(express.json());

app.use(BlogsPath, blogRouter);

app.listen(PORT, () => {
    console.log("app start");
})