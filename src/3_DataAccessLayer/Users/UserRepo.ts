import { ObjectId, WithId } from "mongodb";
import { Repo } from "../_Classes/DataManagment/Repo/Repo"
import { UserRequest } from "../../1_PresentationLayer/_Classes/Data/UserForRequest";
import { UserResponse } from "../../2_BusinessLogicLayer/_Classes/Data/UserForResponse";
import { UserDataBase } from "../_Classes/Data/UserDB";
import { Sorter } from "../_Classes/DataManagment/Sorter";
import { PageHandler } from "../_Classes/DataManagment/PageHandler";
import { Paged } from "../_Types/Paged";
import { UserSorter } from "./UserSorter";


export class UserRepo extends Repo<UserRequest, UserResponse | UserDataBase>{
    ConvertFrom(dbValue: WithId<any>): any {
        let { salt, hash, _id, ...rest } = dbValue;
        let responseUser: any = {
            id: _id.toString(),
            ...rest
        }
        return responseUser;

    }
    ConvertTo(dbValue: UserRequest): UserDataBase {
        return new UserDataBase(dbValue);
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

    override async TakeCertain(id: string): Promise<any | null> {
        let dbValue = await this.db.GetById(this.tableName, id);
        if (dbValue) {
            let { password, ...rest } = dbValue;
            let rerurnValue = this.ConvertFrom(rest);
            return rerurnValue;
        }
        return null;
    }
    override async Update(id: string, reqObj: UserRequest): Promise<any | null> {
        let updatedResult = await this.db.Put(this.tableName, id, reqObj);
        let { password, ...rest } = this.ConvertFrom(updatedResult);

        return rest;
    }

    override async Save(reqObj: any): Promise<any | null> {
        let saveResult = await this.db.Post(this.tableName, reqObj);
        return this.ConvertFrom(saveResult);
    }
    async GetUserByLoginOrEmail(loginOrEmail: string): Promise<any> {
        let foundUser = await this.db.FindBetweenTwoProp(this.tableName, "login", "email", loginOrEmail);
        return foundUser;
    }



    
}