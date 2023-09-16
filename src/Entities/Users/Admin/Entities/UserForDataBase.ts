export class UserDataBase {
    public usedRefreshTokens: Array<string> = []
    constructor(
        public login: string,
        public email: string,
        public salt: string,
        public hashedPass: string,
        public emailConfirmId: string,
        public emailConfirmed: boolean = false,
        public createdAt: string = (new Date()).toISOString()
    ) { }
}
