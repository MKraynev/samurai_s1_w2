import { UserRequest } from "../../1_PresentationLayer/_Classes/Data/UserForRequest";
import { UserRepo } from "../../3_DataAccessLayer/Users/UserRepo";
import { UserSorter } from "../../3_DataAccessLayer/Users/UserSorter";
import { PageHandler } from "../../3_DataAccessLayer/_Classes/DataManagment/PageHandler";
import { Paged } from "../../3_DataAccessLayer/_Types/Paged";
import { UserResponse } from "./Data/UserForResponse";

export class UserService{
    private repo: UserRepo;

    constructor(userRepo: UserRepo) {
        this.repo = userRepo;
    }

    public async SaveUser(user: UserRequest): Promise<UserResponse>{
        
        let savedUser = await this.repo.Save(user);

        return savedUser;
    }

    public async DeleteUser(id: string): Promise<boolean>{
        return this.repo.DeleteCertain(id);
    }

    public async GetUsers(sorter: UserSorter, pageHandler: PageHandler): Promise<Paged<any> | null>{
        let foundValues = await this.repo.TakeAll(sorter, pageHandler);
        //repo.(searchParams, pageHandler);
        return foundValues;
    }

    public async CheckUserLogs(loginOrEmail: string, password: string){
        
    }
}