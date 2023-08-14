import { ObjectId } from "mongodb";
import { PostDataBase } from "../../../3_DataAccessLayer/_Classes/Data/PostForBd";

export class PostResponse extends PostDataBase {
    public id: string;
    constructor(id: ObjectId, dbPost: PostDataBase) {
        super(dbPost);
        this.id = id.toString();
    }
}