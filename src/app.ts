import express from "express";
import { blogRouter } from "./Routes/BlogRouter";

export const app = express();
const PORT: number = 5001;

app.use(express.json());
app.use("/ht_02/api/blogs", blogRouter);

app.listen(PORT, ()=>{
    console.log("app start");
})