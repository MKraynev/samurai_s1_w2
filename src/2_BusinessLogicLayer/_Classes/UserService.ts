import { ObjectId } from "mongodb";
import { UserRequest } from "../../1_PresentationLayer/_Classes/Data/UserForRequest";
import { UserRepo } from "../../3_DataAccessLayer/Users/UserRepo";
import { UserSorter } from "../../3_DataAccessLayer/Users/UserSorter";
import { PageHandler } from "../../3_DataAccessLayer/_Classes/DataManagment/PageHandler";
import { Paged } from "../../3_DataAccessLayer/_Types/Paged";
import { JWT_SECRET } from "../../settings";
import { Token } from "./Data/Token";
import { UserResponse } from "./Data/UserForResponse";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export class UserService {
    private repo: UserRepo;

    constructor(userRepo: UserRepo) {
        this.repo = userRepo;
    }

    public async SaveUser(user: UserRequest): Promise<UserResponse> {
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

    public async DeleteUser(id: string): Promise<boolean> {
        return this.repo.DeleteCertain(id);
    }
    public async ClearUsers(): Promise<boolean> {
        return this.repo.DeleteMany();
    }

    public async GetUsers(sorter: UserSorter, pageHandler: PageHandler): Promise<Paged<any> | null> {
        let foundValues = await this.repo.TakeAll(sorter, pageHandler);
        return foundValues;
    }

    public async CheckUserLogs(loginOrEmail: string, password: string): Promise<any> {

        let user = await this.repo.GetUserByLoginOrEmail(loginOrEmail);

        if (user) {
            let dbHash = user.hash;
            let currentHash = await bcrypt.hash(password, user.salt);

            if (dbHash === currentHash) {

                return new UserResponse(user._id, user);
            }
            return false;
        }
        return false;
    }

    public async GenerateToken(user: any): Promise<Token> {
        let tokenVal = await jwt.sign({ id: user.id}, JWT_SECRET, { expiresIn: "1h" });
        let token: Token = {
            accessToken: tokenVal
        }

        return token;
    }
    public async GetUserByToken(token: Token): Promise<UserResponse | null> {
        let userId = await this.DecodeIdFromToken(token);

        if(userId){
            let user = await this.repo.TakeCertain(userId);

            return user;
        }
        return null;
    }
    private async DecodeIdFromToken(token: Token): Promise<string| null> {
        try {
            let decodeRes: any = await jwt.decode(token.accessToken);
            return decodeRes.id;
        }
        catch {
            return null;
        }
    }
}