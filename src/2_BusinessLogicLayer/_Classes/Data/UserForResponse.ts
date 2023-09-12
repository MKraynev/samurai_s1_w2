import { ObjectId } from "mongodb";
import { UserDataBase } from "../../../3_DataAccessLayer/_Classes/Data/UserDB";

export class UserResponse{
    public id: string;
    public login: string;
    public email: string;
    public createdAt: string;
    public emailConfirmed: Boolean;
    public emailConfirmId: string;
    public usedRefreshTokens: Array<string> = [] 
    constructor(_id: ObjectId, user: UserDataBase) {
        this.id = _id.toString();
        this.login = user.login;
        this.email = user.email;
        this.createdAt = user.createdAt;
        this.emailConfirmed = user.emailConfirmed;
        this.emailConfirmId = user.emailConfirmId;
        this.usedRefreshTokens = user.usedRefreshTokens;
    }
}