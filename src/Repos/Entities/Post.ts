import { ObjectId } from "mongodb";
import { ErrorMessage } from "../../Errors/Error";
import { error } from "console";

export class RequestPostData {
    constructor(
        public title: string = "",
        public shortDescription: string = "",
        public content: string = "",
        public blogId: string = "",
        public blogName: string = "",
        
    ) { }

}
export class RequestSavePostData extends RequestPostData{
    constructor(reqData: RequestPostData,
        public createdAt: string = new Date().toISOString(),
        ){
            super(reqData.title, reqData.shortDescription, reqData.content, reqData.blogId, reqData.blogName)
        }
}


export class ResponsePostData extends RequestSavePostData{
    public id: string;
    constructor(_id: ObjectId, data: RequestSavePostData){
        super(data, data.createdAt);
        this.id = _id.toString();
    }
}
