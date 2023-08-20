import { ObjectId } from "mongodb";

import { UserDataBase } from "../../../3_DataAccessLayer/_Classes/Data/UserDB";
import { UserRequest } from "../../../1_PresentationLayer/_Classes/Data/UserForRequest";

export class UserResponse extends UserRequest{
    public id: string;
    public login: string;
    public email: string;
    public createdAt: string;

    constructor(_id: ObjectId, user: UserDataBase) {
        super(user.login, "", user.email);
        this.id = _id.toString();
        this.login = user.login;
        this.email = user.email;
        this.createdAt = user.createdAt;
    }
}