import { ObjectId } from "mongodb";

export class RequestBlogData {
    constructor(
        public name: string = "",
        public description: string = "",
        public websiteUrl: string = "",
        public createdAt: string = "",
        public isMembership: boolean = false
    ) { }
}

export class ResponseBlogData extends RequestBlogData {
    public id: string;
    constructor(
        _id: ObjectId,
        blogData: RequestBlogData) {
            super(blogData.name, blogData.description, blogData.websiteUrl, blogData.createdAt, blogData.isMembership)
            this.id = _id.toString();
    }
}
