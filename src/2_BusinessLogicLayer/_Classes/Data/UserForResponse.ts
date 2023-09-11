import { ObjectId } from "mongodb";

import { UserDataBase } from "../../../3_DataAccessLayer/_Classes/Data/UserDB";
import { UserRequest } from "../../../1_PresentationLayer/_Classes/Data/UserForRequest";

export class UserResponse{
    public id: string;
    public login: string;
    public email: string;
    public createdAt: string;
    public emailConfirmed: Boolean;
    public emailConfirmId: string;

    constructor(_id: ObjectId, user: UserDataBase) {
        this.id = _id.toString();
        this.login = user.login;
        this.email = user.email;
        this.createdAt = user.createdAt;
        this.emailConfirmed = user.emailConfirmed;
        this.emailConfirmId = user.emailConfirmId;
    }
}