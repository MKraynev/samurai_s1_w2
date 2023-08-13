import { BlogRepo } from "../../../3_DataAccessLayer/Blogs/BlogRepo";

class RepoHandler{
    private _repo: BlogRepo;
    constructor(repo: BlogRepo){
        this._repo = repo;
    }
    TakeAll(){
        this._repo.TakeAll()
    }
}