import { WithId } from "mongodb";
import { Repo } from "../_Classes/DataManagment/Repo/Repo"
import { PostRequest } from "../../1_PresentationLayer/_Classes/Data/PostForRequest";
import { PostDataBase } from "../_Classes/Data/PostForBd";
import { PostResponse } from "../../2_BusinessLogicLayer/_Classes/Data/PostForResponse";


export class PostRepo extends Repo<PostRequest, PostResponse | PostDataBase>{
    ConvertFrom(dbValue: WithId<PostDataBase>): PostResponse {
        return new PostResponse(dbValue._id, dbValue)
    }
    ConvertTo(dbValue: PostRequest): PostDataBase {
        return new PostDataBase(dbValue);
    }
}