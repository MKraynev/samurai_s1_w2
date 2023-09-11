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
import { UniqueValGenerator } from "./UniqueValGenerator";
import { UserDataBase } from "../../3_DataAccessLayer/_Classes/Data/UserDB";
import { WithId } from "mongodb";

export enum LoginEmailStatus {
    LoginAndEmailFree,
    LoginExist,
    EmailEXist

}

export class UserService {
    private repo: UserRepo;

    constructor(userRepo: UserRepo) {
        this.repo = userRepo;
    }

    public async SaveUser(user: UserRequest): Promise<UserResponse> {
        let salt = await bcrypt.genSalt(10);
        let hashedPass = await bcrypt.hash(user.password, salt);

        let emailConfirmId = UniqueValGenerator();

        let userObj = new UserDataBase(user, salt, hashedPass, emailConfirmId);
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

        let user = await this.repo.GetUserByLoginOrEmail(loginOrEmail, true);

        if (user) {
            user = user as WithId<UserDataBase>;
            let dbHash = user.hashedPass;
            let currentHash = await bcrypt.hash(password, user.salt);

            if (dbHash === currentHash) {

                return new UserResponse(user._id, user);
            }
            return false;
        }
        return false;
    }

    public async GenerateToken(user: any): Promise<Token> {
        let tokenVal = await jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
        let token: Token = {
            accessToken: tokenVal
        }

        return token;
    }
    public async GetUserByToken(token: Token): Promise<UserResponse | null> {
        let userId = await this.DecodeIdFromToken(token);

        if (userId) {
            let user = await this.repo.TakeCertain(userId);

            return user;
        }
        return null;
    }
    public async GetUserByMail(email: string): Promise<UserResponse| null>{
        let foundUser = await this.repo.GetUserByLoginOrEmail(email, false) as UserResponse | null;
        return foundUser;
    }
    public async GetUserByConfirmEmailCode(code: string): Promise<UserResponse | null> {
        let foundUser = await this.repo.GetByConfirmEmailCode(code);
        
        return foundUser;
    }

    private async DecodeIdFromToken(token: Token): Promise<string | null> {
        try {
            let decodeRes: any = await jwt.verify(token.accessToken, JWT_SECRET);
            return decodeRes.id;
        }
        catch {
            return null;
        }
    }

    public async CurrentLoginOrEmailExist(login: string, email: string): Promise<LoginEmailStatus> {
        let foundUserByLogin = await this.repo.GetUserByLoginOrEmail(login);
        let foundUserByEmail = await this.repo.GetUserByLoginOrEmail(email);

        if (foundUserByLogin) return LoginEmailStatus.LoginExist;

        if (foundUserByEmail) return LoginEmailStatus.EmailEXist;

        return LoginEmailStatus.LoginAndEmailFree;
    }

    public async ConfirmUser(user: UserResponse): Promise<UserResponse | null>{
        let updatedUser = await this.repo.UpdateProperty(user.id, "emailConfirmed", true);
        return updatedUser;
    }
}