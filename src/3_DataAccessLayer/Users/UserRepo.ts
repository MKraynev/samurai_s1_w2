import { WithId } from "mongodb";
import { Repo } from "../_Classes/DataManagment/Repo/Repo"
import { UserRequest } from "../../1_PresentationLayer/_Classes/Data/UserForRequest";
import { UserResponse } from "../../2_BusinessLogicLayer/_Classes/Data/UserForResponse";
import { UserDataBase } from "../_Classes/Data/UserDB";
import { Sorter } from "../_Classes/DataManagment/Sorter";
import { PageHandler } from "../_Classes/DataManagment/PageHandler";
import { Paged } from "../_Types/Paged";


export class UserRepo extends Repo<UserRequest, UserResponse | UserDataBase>{
    ConvertFrom(dbValue: WithId<UserDataBase>): any {
        let result = new UserResponse(dbValue._id, dbValue)
        let { password, ...rest } = result;

        return rest;

    }
    ConvertTo(dbValue: UserRequest): UserDataBase {
        return new UserDataBase(dbValue);
    }
    override async TakeAll(sorter: Sorter<UserResponse>, pageHandler: PageHandler): Promise<Paged<any[]> | null> {

        let [dbHandler, dbData] = await this.db.GetAll(this.tableName, sorter, pageHandler);


        if (dbData) {
            let returnValues = dbData.map(dbVal => {
                let { password, ...rest } = dbVal;

                return this.ConvertFrom(rest)

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

    override async Save(reqObj: UserRequest): Promise<any | null> {
        let dataForDb = this.ConvertTo(reqObj);
        let saveResult = await this.db.Post(this.tableName, dataForDb);
        let { password, ...rest } = this.ConvertFrom(saveResult);

        return rest;
    }
    async UserExist(loginOrEmail: string, password: string): Promise<boolean> {
        let foundUserByLogin: UserDataBase = await this.db.GetByPropName(this.tableName, "login", loginOrEmail);
        let foundUserByEmail: UserDataBase = await this.db.GetByPropName(this.tableName, "email", loginOrEmail);

        return (foundUserByLogin && foundUserByLogin.password == password) || (foundUserByEmail && foundUserByEmail.password == password)
    }
}