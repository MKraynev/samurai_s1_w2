import { UserRequest } from "../../../1_PresentationLayer/_Classes/Data/UserForRequest";

export class UserDataBase extends UserRequest {
    constructor(
        user: UserRequest,
        public createdAt: string = (new Date()).toISOString()
    ) {
        super(user.login, user.password, user.email)
    }
}
