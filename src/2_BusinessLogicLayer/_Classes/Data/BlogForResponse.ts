import { BlogRequest } from "../../../1_PresentationLayer/_Classes/Data/BlogForRequest";

export class BlogResponse extends BlogRequest {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: string,
        public isMembership: boolean
    ) {
        super(name, description, websiteUrl);
    }
}