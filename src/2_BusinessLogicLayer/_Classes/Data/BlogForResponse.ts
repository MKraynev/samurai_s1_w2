import { ObjectId } from "mongodb";
import { BlogRequest } from "../../../1_PresentationLayer/_Classes/Data/BlogForRequest";
import { BlogDataBase } from "../../../3_DataAccessLayer/_Classes/Data/BlogForBd";

export class BlogResponse extends BlogDataBase {
    public id: string;
    constructor(id: ObjectId, blog: BlogDataBase) {
        super(blog);
        this.id = id.toString();
    }
}