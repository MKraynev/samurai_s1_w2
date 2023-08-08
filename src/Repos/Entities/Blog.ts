import { ObjectId } from "mongodb";

export class RequestBlogData {
    constructor(
        public name: string = "",
        public description: string = "",
        public websiteUrl: string = "",
    ) { }
}

export class RequestSaveBlogData extends RequestBlogData{
    constructor(
        reqData: RequestBlogData,
        public createdAt: string = new Date().toISOString(),
        public isMembership: boolean = false
    ){
        super(reqData.name, reqData.description, reqData.websiteUrl)
    }
}

export class ResponseBlogData extends RequestSaveBlogData {
    public id: string;
    constructor(
        _id: ObjectId,
        blogData: RequestSaveBlogData,
    ) {
        super(blogData)
        this.id = _id.toString();
    }
}
