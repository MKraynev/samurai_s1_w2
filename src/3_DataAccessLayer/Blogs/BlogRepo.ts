import { WithId } from "mongodb";
import { BlogRequest } from "../../1_PresentationLayer/_Classes/Data/BlogForRequest";
import { BlogResponse } from "../../2_BusinessLogicLayer/_Classes/Data/BlogForResponse";
import { Repo } from "../_Classes/DataManagment/Repo/Repo"

export class BlogRepo extends Repo<BlogRequest, BlogResponse>{
    ConvertTo(dbValue: any): BlogResponse {
        let id = dbValue._id.toString();
        let {name, description, websiteUrl, createdAt, isMembership} = dbValue;
        return new BlogResponse(id, name, description, websiteUrl, createdAt, isMembership);
    }
}