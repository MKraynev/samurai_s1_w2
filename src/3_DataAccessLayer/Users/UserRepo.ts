import { ObjectId, WithId } from "mongodb";
import { Repo } from "../_Classes/DataManagment/Repo/Repo"
import { UserRequest } from "../../1_PresentationLayer/_Classes/Data/UserForRequest";
import { UserResponse } from "../../2_BusinessLogicLayer/_Classes/Data/UserForResponse";
import { UserDataBase } from "../_Classes/Data/UserDB";
import { Sorter } from "../_Classes/DataManagment/Sorter";
import { PageHandler } from "../_Classes/DataManagment/PageHandler";
import { Paged } from "../_Types/Paged";
import { UserSorter } from "./UserSorter";
import { Token } from "../../2_BusinessLogicLayer/_Classes/Data/Token";


export class UserRepo extends Repo<UserRequest, UserResponse | UserDataBase>{
    ConvertFrom(dbValue: WithId<any>): UserResponse {
        let { salt, hash, _id, ...rest } = dbValue;
        // let responseUser: any = {
        //     id: _id.toString(),
        //     ...rest
        // }

        let respUser = new UserResponse(dbValue._id, dbValue);
        return respUser;

    }
    ConvertTo(reqValue: UserRequest): UserDataBase {
        return new UserDataBase(reqValue, "", "", "", "");
    }
    override async TakeAll(sorter: UserSorter, pageHandler: PageHandler): Promise<Paged<any[]> | null> {

        let [dbHandler, dbData] = await this.db.GetAll(this.tableName, sorter, pageHandler);


        if (dbData) {
            let returnValues = dbData.map(dbVal => {
                return this.ConvertFrom(dbVal)
            })
            let pagedData = dbHandler.GetPaged(returnValues);
            return pagedData;
        }
        return null;
    }

    override async TakeCertain(id: string): Promise<UserResponse | null> {
        let dbValue = await this.db.GetById(this.tableName, id);
        if (dbValue) {
            let rerurnValue = this.ConvertFrom(dbValue);
            return rerurnValue;
        }
        return null;
    }
    override async Update(id: string, reqObj: UserRequest): Promise<any | null> {
        let updatedResult = await this.db.Put(this.tableName, id, reqObj);
        //let { password, ...rest } = this.ConvertFrom(updatedResult);
        let respUser = this.ConvertFrom(updatedResult);

        return respUser;
    }
    async UpdateProperty(id: string, propertyName: string, propertyVal: string | boolean | number): Promise<UserResponse | null>{
        let updatedObj = await this.db.PutProp(this.tableName, id, propertyName, propertyVal);
        if(updatedObj){
            let respUser = this.ConvertFrom(updatedObj);
            return respUser;
        }
        return null;
    }
    async AppendToken(id: string, token: Token): Promise<boolean>{
        return await this.db.PushProp(this.tableName, id, "usedRefreshTokens", token.accessToken);
    }
    override async Save(reqObj: any): Promise<any | null> {
        let saveResult = await this.db.Post(this.tableName, reqObj);
        return this.ConvertFrom(saveResult);
    }
    async GetUserByLoginOrEmail(loginOrEmail: string, rawData: boolean = false): Promise<UserResponse |WithId<UserDataBase>| null> {
        let foundUser: WithId<UserDataBase> = await this.db.FindBetweenTwoProp(this.tableName, "login", "email", loginOrEmail);
        if(foundUser){
            let returnVal = rawData? foundUser: this.ConvertFrom(foundUser)
            return returnVal;
        }
        return null;
    }

    async GetByConfirmEmailCode(code: string): Promise<UserResponse | null>{
        let foundVal = await this.db.GetByPropName(this.tableName, "emailConfirmId", code);

        if(foundVal){
            return this.ConvertFrom(foundVal);
        }
        return null;
    }



    
}