import { UserRequest } from "../../1_PresentationLayer/_Classes/Data/UserForRequest";
import { UserRepo } from "../../3_DataAccessLayer/Users/UserRepo";
import { UserSorter } from "../../3_DataAccessLayer/Users/UserSorter";
import { PageHandler } from "../../3_DataAccessLayer/_Classes/DataManagment/PageHandler";
import { Paged } from "../../3_DataAccessLayer/_Types/Paged";
import { UserResponse } from "./Data/UserForResponse";
import bcrypt from "bcrypt";

export class UserService{
    private repo: UserRepo;

    constructor(userRepo: UserRepo) {
        this.repo = userRepo;
    }

    public async SaveUser(user: UserRequest): Promise<UserResponse>{
        let salt = await bcrypt.genSalt(10);
        let hashedPass = await bcrypt.hash(user.password, salt);
        
        let userObj = {
            login: user.login,
            email: user.email,
            salt: salt,
            hash: hashedPass,
            createdAt: (new Date()).toISOString()
        }
        let savedUser = await this.repo.Save(userObj);

        return savedUser;
    }

    public async DeleteUser(id: string): Promise<boolean>{
        return this.repo.DeleteCertain(id);
    }
    public async ClearUsers(): Promise<boolean>{
        return this.repo.DeleteMany();
    }

    public async GetUsers(sorter: UserSorter, pageHandler: PageHandler): Promise<Paged<any> | null>{
        let foundValues = await this.repo.TakeAll(sorter, pageHandler);
        return foundValues;
    }

    public async CheckUserLogs(loginOrEmail: string, password: string): Promise<boolean>{

        let user = await this.repo.GetUserByLoginOrEmail(loginOrEmail);

        if(user){
            let dbHash = user.hash;
            let currentHash = await bcrypt.hash(password, user.salt);
            
            return dbHash === currentHash;
        }
        return false;
    }


    
}