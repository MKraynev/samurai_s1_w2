import { userInfo } from "os";
import { UserRequest } from "./UserForRequest";

export class UserDataBase {
    public login: string;
    public email: string;
    public usedRefreshTokens: Array<string> = []
    constructor(
        user: UserRequest,
        public salt: string,
        public hashedPass: string,
        public emailConfirmId: string,
        public emailConfirmed: boolean = false,
        public createdAt: string = (new Date()).toISOString()
    ) {
        this.login = user.login;
        this.email = user.email;
    }
}
