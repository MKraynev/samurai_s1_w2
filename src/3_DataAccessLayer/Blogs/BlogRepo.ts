import { WithId } from "mongodb";
import { BlogRequest } from "../../1_PresentationLayer/_Classes/Data/BlogForRequest";
import { BlogResponse } from "../../2_BusinessLogicLayer/_Classes/Data/BlogForResponse";
import { Repo } from "../_Classes/DataManagment/Repo/Repo"
import { BlogDataBase } from "../_Classes/Data/BlogDB";

export class BlogRepo extends Repo<BlogRequest, BlogResponse | BlogDataBase>{
    ConvertFrom(dbValue: WithId<BlogDataBase>): BlogResponse {
        return new BlogResponse(dbValue._id, dbValue)
    }
    ConvertTo(dbValue: BlogRequest): BlogDataBase {
        return new BlogDataBase(dbValue);
    }
}