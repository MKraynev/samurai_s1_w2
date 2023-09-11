import { userInfo } from "os";
import { UserRequest } from "../../../1_PresentationLayer/_Classes/Data/UserForRequest";

export class UserDataBase{
    public emailConfirmed = false;
    public login: string;
    public email: string;

    constructor(
        user: UserRequest,
        public salt: string,
        public hashedPass: string,
        public emailConfirmId: string,
        public createdAt: string = (new Date()).toISOString()
    ) {
        this.login = user.login;
        this.email = user.email;
    }
}
