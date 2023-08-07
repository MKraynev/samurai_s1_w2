import { ObjectId } from "mongodb";

export class RequestPostData {
    constructor(
        public title: string = "",
        public shortDescription: string = "",
        public content: string = "",
        public blogId: string = "",
        public blogName: string = "",
        public createdAt: string = (new Date()).toISOString(),
        public isMembership: boolean = false
    ) { }
}

export class ResponsePostData extends RequestPostData{
    constructor(_id: ObjectId, data: RequestPostData){
        super(data.title, data.shortDescription, data.content, data.blogId, data.blogName, data.createdAt, data.isMembership)
    }
}
