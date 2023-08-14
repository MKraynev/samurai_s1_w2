import { BlogRepo } from "../../3_DataAccessLayer/Blogs/BlogRepo";
import { mongoDb } from "../../3_DataAccessLayer/MongoDb/MongoDb";
import { PostRepo } from "../../3_DataAccessLayer/Posts/PostRepo";
import { _BlogRepo } from "../../_legacy/Repos/BlogRepo";

const blogRepo = new BlogRepo(mongoDb, "blogs");
const postRepo = new PostRepo(mongoDb, "posts");


class DataManager {
    public blogRepo: BlogRepo;
    public postRepo: PostRepo;

    constructor(blog: BlogRepo, post: PostRepo) {
        this.blogRepo = blog;
        this.postRepo = post;
    }

    async Run(): Promise<boolean> {
        let repoRunStatuses: boolean[] = [];
        repoRunStatuses.push(await this.blogRepo.RunDb());
        repoRunStatuses.push(await this.postRepo.RunDb());

        let ConnectionFailed = repoRunStatuses.includes(false);

        if (ConnectionFailed) {
            console.log("Data manager: db connection failed");
        }
        return ConnectionFailed;
    }

}

export const dataManager = new DataManager(blogRepo, postRepo);