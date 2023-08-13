import { BlogRepo } from "../../3_DataAccessLayer/Blogs/BlogRepo";
import { mongoDb } from "../../3_DataAccessLayer/MongoDb/MongoDb";
import { _BlogRepo } from "../../_legacy/Repos/BlogRepo";

const blogRepo = new BlogRepo(mongoDb, "blogs");

class DataManager {
    public blogRepo: BlogRepo;

    constructor(blog: BlogRepo) {
        this.blogRepo = blog;
    }

    async Run(): Promise<boolean> {
        let repoRunStatuses: boolean[] = [];
        repoRunStatuses.push(await this.blogRepo.RunDb());
        let positiveConnectionStatus = repoRunStatuses.includes(false);

        // if(!positiveConnectionStatus){
        //     console.log("Data manager: db connection failed");
        // }
        return positiveConnectionStatus;
    }

}

export const dataManager = new DataManager(blogRepo);
