import { UserRequest } from "../../Admin/Entities/UserForRequest";
import { UserSorter } from "../../Repo/UserSorter";
import { Paginator } from "../../../../Common/Paginator/PageHandler";
import { Page } from "../../../../Common/Paginator/Page";
import { ACCESS_TOKEN_TIME, JWT_SECRET, REFRESH_TOKEN_TIME } from "../../../../settings";
import { Token } from "../Entities/Token";
import { UserResponse } from "../../Admin/Entities/UserForResponse";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken"
import { UniqueValGenerator } from "../../../../Common/DataManager/HandleFunctions/UniqueValGenerator";
import { UserDataBase } from "../../Admin/Entities/UserForDataBase";
import { MongoDb, mongoDb } from "../../../../Common/Database/MongoDb";
import { AvailableDbTables, ExecutionResult, ExecutionResultContainer } from "../../../../Common/Database/DataBase";
import { TokenHandler, TokenLoad, TokenStatus, tokenHandler } from "../../../../Common/Authentication/User/TokenAuthentication";
import { ServiseExecutionStatus } from "../../../Blogs/BuisnessLogic/BlogService";
import { AdminAuthentication, AuthenticationResult, IAuthenticator } from "../../../../Common/Authentication/Admin/AdminAuthenticator";
import { Request } from "express"
import { AuthRequest } from "../Entities/AuthRequest";

export enum LoginEmailStatus {
    LoginAndEmailFree,
    LoginExist,
    EmailEXist

}

export enum UserServiceExecutionResult {
    DataBaseFailed,
    Unauthorized,
    NotFound,
    WrongPassword,
    ServiceFail,
    UserAlreadyExist,
    Success
}

export type UserServiceDto = ExecutionResultContainer<ExecutionResult, UserResponse>;
export type UserServiceDtos = ExecutionResultContainer<ExecutionResult, UserResponse[]>;
type LoginTokens = {
    accessToken: Token,
    refreshToken: Token
}

export class AdminUserService {
    private userTable = AvailableDbTables.users;
    private usedTokenName = "usedRefreshTokens";

    constructor(private _db: MongoDb, private _authenticator: IAuthenticator, private tokenHandler: TokenHandler) { }

    public async GetUsers(searchConfig: UserSorter, paginator: Paginator, request: Request): Promise<ExecutionResultContainer<ServiseExecutionStatus, Page<UserResponse[]> | null>> {
        let accessVerdict = this._authenticator.AccessCheck(request);

        if (accessVerdict !== AuthenticationResult.Accept)
            return new ExecutionResultContainer(ServiseExecutionStatus.Unauthorized);

        let countOperation = await this._db.Count(this.userTable, searchConfig);

        if (countOperation.executionStatus === ExecutionResult.Failed || countOperation.executionResultObject === null)
            return new ExecutionResultContainer(ServiseExecutionStatus.DataBaseFailed);

        let neededSkipObjectsNumber = paginator.GetAvailableSkip(countOperation.executionResultObject);
        let foundObjectsOperation = await this._db.GetMany(this.userTable, searchConfig, neededSkipObjectsNumber, paginator.pageSize) as UserServiceDtos;

        if (foundObjectsOperation.executionStatus === ExecutionResult.Failed || !foundObjectsOperation.executionResultObject)
            return new ExecutionResultContainer(ServiseExecutionStatus.DataBaseFailed);

        let pagedObjects = paginator.GetPaged(foundObjectsOperation.executionResultObject);
        let operationResult = new ExecutionResultContainer(ServiseExecutionStatus.Success, pagedObjects)

        return operationResult;
    }
    public async SaveUser(user: UserRequest, request: Request): Promise<ExecutionResultContainer<UserServiceExecutionResult, UserResponse | null>> {
        let accessVerdict = this._authenticator.AccessCheck(request);

        if (accessVerdict !== AuthenticationResult.Accept)
            return new ExecutionResultContainer(UserServiceExecutionResult.Unauthorized);

        user.emailConfirmed = true;
        return await this.PostUser(user);
    }
    public async RegisterUser(user: UserRequest): Promise<ExecutionResultContainer<UserServiceExecutionResult, UserResponse | null>> {
        user.emailConfirmed = false;
        return await this.PostUser(user);
    }

    private async PostUser(user: UserRequest): Promise<ExecutionResultContainer<UserServiceExecutionResult, UserResponse | null>> {
        let findUserByLogin = await this._db.GetOneByValueInOnePropery(this.userTable, "login", user.login);
        let findUserByEmail = await this._db.GetOneByValueInOnePropery(this.userTable, "email", user.email);

        if (findUserByEmail.executionResultObject || findUserByLogin.executionResultObject) {

            throw new ExecutionResultContainer(UserServiceExecutionResult.UserAlreadyExist);
        }

        let salt = await bcrypt.genSalt(10);
        let hashedPass = await bcrypt.hash(user.password, salt);
        let emailConfirmId = UniqueValGenerator();

        let userObj = new UserDataBase(user.login, user.email, salt, hashedPass, emailConfirmId, user.emailConfirmed);
        let save = await this._db.SetOne(this.userTable, userObj) as UserServiceDto;

        if (save.executionStatus === ExecutionResult.Failed) {
            return new ExecutionResultContainer(UserServiceExecutionResult.DataBaseFailed);
        }
        return new ExecutionResultContainer(UserServiceExecutionResult.Success, save.executionResultObject);
    }

    public async DeleteUser(id: string, request: Request<{}, {}, {}, {}>): Promise<ExecutionResultContainer<ServiseExecutionStatus, boolean | null>> {
        let accessVerdict = this._authenticator.AccessCheck(request);

        if (accessVerdict !== AuthenticationResult.Accept)
            return new ExecutionResultContainer(ServiseExecutionStatus.Unauthorized);

        let deleteOperation = await this._db.DeleteOne(this.userTable, id);

        if (deleteOperation.executionStatus === ExecutionResult.Failed)
            return new ExecutionResultContainer(ServiseExecutionStatus.DataBaseFailed);

        if (!deleteOperation.executionResultObject) {
            return new ExecutionResultContainer(ServiseExecutionStatus.NotFound);
        }

        return new ExecutionResultContainer(ServiseExecutionStatus.Success, true);
    }

    public async Login(authRequest: AuthRequest): Promise<ExecutionResultContainer<UserServiceExecutionResult, LoginTokens>> {
        let findUser = await this._db.GetOneByValueInTwoProperties(this.userTable, "email", "login", authRequest.loginOrEmail) as UserServiceDto;

        if (findUser.executionStatus === ExecutionResult.Failed || !findUser.executionResultObject) {
            return new ExecutionResultContainer(UserServiceExecutionResult.DataBaseFailed);
        }

        let requestHashedPass = await bcrypt.hash(authRequest.password, findUser.executionResultObject.salt);
        if (requestHashedPass !== findUser.executionResultObject.hashedPass) {
            return new ExecutionResultContainer(UserServiceExecutionResult.WrongPassword);
        }
        let tokenLoad: TokenLoad = {
            id: findUser.executionResultObject.id
        };

        // tokenLoad.id = findUser.executionResultObject.id;

        let accessToken = await this.tokenHandler.GenerateToken(tokenLoad, ACCESS_TOKEN_TIME);
        let refreshToken = await this.tokenHandler.GenerateToken(tokenLoad, REFRESH_TOKEN_TIME);

        if (!accessToken || !refreshToken) {
            return new ExecutionResultContainer(UserServiceExecutionResult.ServiceFail);
        }

        let tokens: LoginTokens = {
            accessToken: accessToken,
            refreshToken: refreshToken
        }

        return new ExecutionResultContainer(UserServiceExecutionResult.Success, tokens);
    }
    public async GetUserByToken(token: Token): Promise<ExecutionResultContainer<UserServiceExecutionResult, UserResponse>> {
        let parceUserId = await this.tokenHandler.DecodePropertyFromToken(token, "id");

        if (parceUserId.tokenStatus !== TokenStatus.Accepted || !parceUserId.propertyVal) {
            return new ExecutionResultContainer(UserServiceExecutionResult.NotFound);
        }
        let id = parceUserId.propertyVal as string;

        let userSearch = await this._db.GetOneById(this.userTable, id) as UserServiceDto;
        if (userSearch.executionStatus === ExecutionResult.Failed || !userSearch.executionResultObject) {
            return new ExecutionResultContainer(UserServiceExecutionResult.DataBaseFailed);
        }

        return new ExecutionResultContainer(UserServiceExecutionResult.Success, userSearch.executionResultObject);
    }
    public async RefreshUserAccess(refreshToken: Token): Promise<ExecutionResultContainer<UserServiceExecutionResult, LoginTokens>> {
        let parceUserId = await this.tokenHandler.DecodePropertyFromToken(refreshToken, "id");

        if (parceUserId.tokenStatus !== TokenStatus.Accepted || !parceUserId.propertyVal)
            return new ExecutionResultContainer(UserServiceExecutionResult.NotFound);

        let id = parceUserId.propertyVal as string;

        let appendToUser = await this._db.AppendOneProperty(this.userTable, id, this.usedTokenName, refreshToken.accessToken);
        if (appendToUser.executionStatus === ExecutionResult.Failed)
            return new ExecutionResultContainer(UserServiceExecutionResult.NotFound);

        let includedObj: TokenLoad = {
            id: id
        };
        // includedObj.id = id;

        let accessToken = await this.tokenHandler.GenerateToken(includedObj, ACCESS_TOKEN_TIME);
        let newRefreshToken = await this.tokenHandler.GenerateToken(includedObj, REFRESH_TOKEN_TIME);

        if (accessToken && newRefreshToken) {
            let tokens: LoginTokens = {
                accessToken: accessToken,
                refreshToken: newRefreshToken
            }
            return new ExecutionResultContainer(UserServiceExecutionResult.Success, tokens);
        }
        return new ExecutionResultContainer(UserServiceExecutionResult.ServiceFail);
    }
    public async GetConfirmId(userEmail: string): Promise<ExecutionResultContainer<UserServiceExecutionResult, UserResponse>> {
        let findUser = await this._db.GetOneByValueInOnePropery(this.userTable, "email", userEmail) as UserServiceDto;

        if (findUser.executionStatus !== ExecutionResult.Pass || !findUser.executionResultObject) {
            return new ExecutionResultContainer(UserServiceExecutionResult.NotFound);
        }
        let emailConfirmId = UniqueValGenerator();
        let setNewConfirmId = await this._db.UpdateOneProperty(this.userTable, findUser.executionResultObject.id, "emailConfirmId", emailConfirmId) as UserServiceDto;

        if (setNewConfirmId.executionStatus === ExecutionResult.Pass)
            return new ExecutionResultContainer(UserServiceExecutionResult.Success, setNewConfirmId.executionResultObject);

        return new ExecutionResultContainer(UserServiceExecutionResult.ServiceFail);
    }
    public async ConfirmUser(confirmId: string): Promise<ExecutionResultContainer<UserServiceExecutionResult, UserResponse>> {
        let findUser = await this._db.GetOneByValueInOnePropery(this.userTable, "emailConfirmId", confirmId) as UserServiceDto;

        if (findUser.executionStatus === ExecutionResult.Failed || !findUser.executionResultObject)
            return new ExecutionResultContainer(UserServiceExecutionResult.NotFound);

        let confirmUser = await this._db.UpdateOneProperty(this.userTable, findUser.executionResultObject.id, "emailConfirmed", true) as UserServiceDto;
        if (confirmUser.executionStatus === ExecutionResult.Pass && confirmUser.executionResultObject)
            return new ExecutionResultContainer(UserServiceExecutionResult.Success, confirmUser.executionResultObject);

            return new ExecutionResultContainer(UserServiceExecutionResult.DataBaseFailed);
    }
    // public async UpdateUserEmailConfirmId(userId: string): Promise<string | null> {
    //     try {
    //         let emailConfirmId = UniqueValGenerator();
    //         let updatedUser = await this.repo.UpdateProperty(userId, "emailConfirmId", emailConfirmId);
    //         if (updatedUser) {
    //             return emailConfirmId;
    //         }
    //         return null;
    //     }
    //     catch {
    //         return null;
    //     }
    // }

    // public async DeleteUser(id: string): Promise<boolean> {
    //     return this.repo.DeleteCertain(id);
    // }
    // public async ClearUsers(): Promise<boolean> {
    //     return this.repo.DeleteMany();
    // }

    // public async GetUsers(sorter: UserSorter, pageHandler: Paginator): Promise<Page<any> | null> {
    //     let foundValues = await this.repo.TakeAll(sorter, pageHandler);
    //     return foundValues;
    // }

    // public async CheckUserLogs(loginOrEmail: string, password: string): Promise<UserResponse | null> {

    //     let user = await this.repo.GetUserByLoginOrEmail(loginOrEmail, true);

    //     if (user) {
    //         user = user as WithId<UserDataBase>;
    //         let dbHash = user.hashedPass;
    //         let currentHash = await bcrypt.hash(password, user.salt);

    //         if (dbHash === currentHash) {

    //             return new UserResponse(user._id, user);
    //         }
    //         return null;
    //     }
    //     return null;
    // }

    public async GenerateTokens(user: UserResponse): Promise<Array<Token>> {
        let accessTokenVal = await jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TIME });
        let refreshTokenVal = await jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_TIME });

        let accessToken: Token = {
            accessToken: accessTokenVal
        }
        let refreshToken: Token = {
            accessToken: refreshTokenVal
        }

        let tokens: Array<Token> = [accessToken, refreshToken];


        return tokens;
    }
    // public async RefreshTokens(currentRefreshToken: Token): Promise<Array<Token> | null> {
    //     let user = await this.GetUserByToken(currentRefreshToken);
    //     if (!user) return null;

    //     let updateRes = await this.repo.AppendToken(user.id, currentRefreshToken);
    //     if (!updateRes) return null;

    //     return this.GenerateTokens(user);
    // }

    // public async RefreshTokenNotUsed(userId: string, token: string): Promise<boolean> {
    //     let user = await this.repo.TakeCertain(userId);

    //     return !!user && !user.usedRefreshTokens.includes(token);
    // }

    // public async isTokenExpired(token: Token): Promise<boolean> {
    //     try {
    //         let decoded = await jwt.decode(token.accessToken) as JwtPayload;
    //         if (decoded && decoded.exp) {
    //             let nowTime: number = Date.now()
    //             let verdict = nowTime >= decoded.exp * 1000;

    //             return verdict;
    //         }
    //         return true;
    //     }
    //     catch {
    //         return true;
    //     }


    // }
    // public async GetUserByToken(token: Token): Promise<UserResponse | null> {
    //     let userId = await this.DecodeIdFromToken(token);

    //     if (userId) {
    //         let user = await this.repo.TakeCertain(userId);

    //         return user;
    //     }
    //     return null;
    // }
    // public async GetUserByMail(email: string): Promise<UserResponse | null> {
    //     let foundUser = await this.repo.GetUserByLoginOrEmail(email, false) as UserResponse | null;
    //     return foundUser;
    // }
    // public async GetUserByConfirmEmailCode(code: string): Promise<UserResponse | null> {
    //     let foundUser = await this.repo.GetByConfirmEmailCode(code);

    //     return foundUser;
    // }

    // private async DecodeIdFromToken(token: Token): Promise<string | null> {
    //     try {
    //         let decodeRes: any = await jwt.verify(token.accessToken, JWT_SECRET);
    //         return decodeRes.id;
    //     }
    //     catch {
    //         return null;
    //     }
    // }

    // public async CurrentLoginOrEmailExist(login: string, email: string): Promise<LoginEmailStatus> {
    //     let foundUserByLogin = await this.repo.GetUserByLoginOrEmail(login);
    //     let foundUserByEmail = await this.repo.GetUserByLoginOrEmail(email);

    //     if (foundUserByLogin) return LoginEmailStatus.LoginExist;

    //     if (foundUserByEmail) return LoginEmailStatus.EmailEXist;

    //     return LoginEmailStatus.LoginAndEmailFree;
    // }

    // public async ConfirmUser(user: UserResponse): Promise<UserResponse | null> {
    //     let updatedUser = await this.repo.UpdateProperty(user.id, "emailConfirmed", true);
    //     return updatedUser;
    // }
}
export const userService = new AdminUserService(mongoDb, AdminAuthentication, tokenHandler)