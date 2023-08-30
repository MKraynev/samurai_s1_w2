import { BlogRepo } from "../../3_DataAccessLayer/Blogs/BlogRepo";
import { mongoDb } from "../../3_DataAccessLayer/MongoDb/MongoDb";
import { PostRepo } from "../../3_DataAccessLayer/Posts/PostRepo";
import { UserRepo } from "../../3_DataAccessLayer/Users/UserRepo";
import { UserSorter } from "../../3_DataAccessLayer/Users/UserSorter";
import { PageHandler } from "../../3_DataAccessLayer/_Classes/DataManagment/PageHandler";
import { _BlogRepo } from "../../_legacy/Repos/BlogRepo";
import { UserService } from "./UserService";

const blogRepo = new BlogRepo(mongoDb, "blogs");
const postRepo = new PostRepo(mongoDb, "posts");
const userRepo = new UserRepo(mongoDb, "users");
const userService = new UserService(userRepo);
class DataManager {
    public blogRepo: BlogRepo;
    public postRepo: PostRepo;
    public userService: UserService;

    constructor(blog: BlogRepo, post: PostRepo, user: UserService) {
        this.blogRepo = blog;
        this.postRepo = post;
        this.userService = user;
    }

    async Run(): Promise<boolean> {
        let repoRunStatuses: boolean[] = [];
        repoRunStatuses.push(await this.blogRepo.RunDb());
        repoRunStatuses.push(await this.postRepo.RunDb());
        

        let ConnectionFailed = repoRunStatuses.includes(false);

        if (ConnectionFailed) {
            console.log("Data manager: db connection failed");
        }
        return !ConnectionFailed;
    }
}

export const dataManager = new DataManager(blogRepo, postRepo, userService);