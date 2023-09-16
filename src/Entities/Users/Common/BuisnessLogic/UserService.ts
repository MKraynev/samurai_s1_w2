import { UserRequest } from "../../Admin/Entities/UserForRequest";
// import { UserRepo } from "../../Repo/UserRepo";
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
import { WithId } from "mongodb";
import { type } from "os";

export enum LoginEmailStatus {
    LoginAndEmailFree,
    LoginExist,
    EmailEXist

}

// export class UserService {
//     private repo: UserRepo;

//     constructor(userRepo: UserRepo) {
//         this.repo = userRepo;
//     }

//     public async SaveUser(user: UserRequest): Promise<UserResponse> {
//         let salt = await bcrypt.genSalt(10);
//         let hashedPass = await bcrypt.hash(user.password, salt);

//         let emailConfirmId = UniqueValGenerator();

//         let userObj = new UserDataBase(user.login, user.email, salt, hashedPass, emailConfirmId);
//         let savedUser = await this.repo.Save(userObj);

//         return savedUser;
//     }
//     public async UpdateUserEmailConfirmId(userId: string): Promise<string | null> {
//         try {
//             let emailConfirmId = UniqueValGenerator();
//             let updatedUser = await this.repo.UpdateProperty(userId, "emailConfirmId", emailConfirmId);
//             if (updatedUser) {
//                 return emailConfirmId;
//             }
//             return null;
//         }
//         catch {
//             return null;
//         }
//     }

//     public async DeleteUser(id: string): Promise<boolean> {
//         return this.repo.DeleteCertain(id);
//     }
//     public async ClearUsers(): Promise<boolean> {
//         return this.repo.DeleteMany();
//     }

//     public async GetUsers(sorter: UserSorter, pageHandler: Paginator): Promise<Page<any> | null> {
//         let foundValues = await this.repo.TakeAll(sorter, pageHandler);
//         return foundValues;
//     }

//     public async CheckUserLogs(loginOrEmail: string, password: string): Promise<UserResponse | null> {

//         let user = await this.repo.GetUserByLoginOrEmail(loginOrEmail, true);

//         if (user) {
//             user = user as WithId<UserDataBase>;
//             let dbHash = user.hashedPass;
//             let currentHash = await bcrypt.hash(password, user.salt);

//             if (dbHash === currentHash) {

//                 return new UserResponse(user._id, user);
//             }
//             return null;
//         }
//         return null;
//     }

//     public async GenerateTokens(user: UserResponse): Promise<Array<Token>> {
//         let accessTokenVal = await jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TIME });
//         let refreshTokenVal = await jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_TIME });

//         let accessToken: Token = {
//             accessToken: accessTokenVal
//         }
//         let refreshToken: Token = {
//             accessToken: refreshTokenVal
//         }

//         let tokens: Array<Token> = [accessToken, refreshToken];


//         return tokens;
//     }
//     public async RefreshTokens(currentRefreshToken: Token): Promise<Array<Token> | null> {
//         let user = await this.GetUserByToken(currentRefreshToken);
//         if (!user) return null;

//         let updateRes = await this.repo.AppendToken(user.id, currentRefreshToken);
//         if (!updateRes) return null;

//         return this.GenerateTokens(user);
//     }

//     public async RefreshTokenNotUsed(userId: string, token: string): Promise<boolean> {
//         let user = await this.repo.TakeCertain(userId);

//         return !!user && !user.usedRefreshTokens.includes(token);
//     }

//     public async isTokenExpired(token: Token): Promise<boolean> {
//         try {
//             let decoded = await jwt.decode(token.accessToken) as JwtPayload;
//             if (decoded && decoded.exp) {
//                 let nowTime: number = Date.now()
//                 let verdict = nowTime >= decoded.exp * 1000;
                
//                 return verdict;
//             }
//             return true;
//         }
//         catch {
//             return true;
//         }


//     }
//     public async GetUserByToken(token: Token): Promise<UserResponse | null> {
//         let userId = await this.DecodeIdFromToken(token);

//         if (userId) {
//             let user = await this.repo.TakeCertain(userId);

//             return user;
//         }
//         return null;
//     }
//     public async GetUserByMail(email: string): Promise<UserResponse | null> {
//         let foundUser = await this.repo.GetUserByLoginOrEmail(email, false) as UserResponse | null;
//         return foundUser;
//     }
//     public async GetUserByConfirmEmailCode(code: string): Promise<UserResponse | null> {
//         let foundUser = await this.repo.GetByConfirmEmailCode(code);

//         return foundUser;
//     }

//     private async DecodeIdFromToken(token: Token): Promise<string | null> {
//         try {
//             let decodeRes: any = await jwt.verify(token.accessToken, JWT_SECRET);
//             return decodeRes.id;
//         }
//         catch {
//             return null;
//         }
//     }

//     public async CurrentLoginOrEmailExist(login: string, email: string): Promise<LoginEmailStatus> {
//         let foundUserByLogin = await this.repo.GetUserByLoginOrEmail(login);
//         let foundUserByEmail = await this.repo.GetUserByLoginOrEmail(email);

//         if (foundUserByLogin) return LoginEmailStatus.LoginExist;

//         if (foundUserByEmail) return LoginEmailStatus.EmailEXist;

//         return LoginEmailStatus.LoginAndEmailFree;
//     }

//     public async ConfirmUser(user: UserResponse): Promise<UserResponse | null> {
//         let updatedUser = await this.repo.UpdateProperty(user.id, "emailConfirmed", true);
//         return updatedUser;
//     }
// }