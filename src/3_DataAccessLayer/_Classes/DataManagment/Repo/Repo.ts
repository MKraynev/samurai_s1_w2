import { isDeleteExpression } from "typescript";
import { ResponseBlogData } from "../../../../_legacy/Repos/Entities/Blog";
import { IDataAccess } from "../../../_Interfaces/IDataAccess";
import { Paged } from "../../../_Types/Paged";
import { DataBase } from "../../DataBase/DataBase";
import { PageHandler } from "../PageHandler";
import { Sorter } from "../Sorter";

export abstract class Repo<RequestDataPresentation, ResponseDataPresentation extends RequestDataPresentation>
    implements IDataAccess<RequestDataPresentation, ResponseDataPresentation>{

    constructor(private db: DataBase, private tableName: string) { }

    //Methods
    async TakeCertain(id: string): Promise<ResponseDataPresentation | null> {
        let dbValue = await this.db.GetById(this.tableName, id);
        if (dbValue) {
            let rerurnValue = this.ConvertTo(dbValue);
            return rerurnValue;
        }
        return null;
    }

    async TakeAll(sorter: Sorter<ResponseDataPresentation>, pageHandler: PageHandler): Promise<Paged<ResponseDataPresentation[]> | null> {

        let [dbHandler, dbData] = await this.db.GetAll(this.tableName, sorter, pageHandler);


        if (dbData) {
            let returnValues = dbData.map(dbVal => this.ConvertFrom(dbVal))
            let pagedData = dbHandler.GetPaged(returnValues);
            return pagedData;
        }
        return null;
    }

    async Save(reqObj: RequestDataPresentation): Promise<ResponseDataPresentation | null> {
        let dataForDb = this.ConvertTo(reqObj);
        let saveResult = await this.db.Post(this.tableName, dataForDb);
        let returnResult = this.ConvertFrom(saveResult);
        return returnResult;
    }

    async Update(id: string, reqObj: RequestDataPresentation): Promise<ResponseDataPresentation | null> {
        let updatedResult = await this.db.Put(this.tableName, id, reqObj);
        let returnResult = this.ConvertFrom(updatedResult);

        return returnResult;
    }

    async DeleteCertain(id: string): Promise<boolean> {
        let delResult = await this.db.Delete(this.tableName, id);
        return delResult;

    }

    async DeleteMany(): Promise<boolean> {
        let delRes = await this.db.DeleteAll(this.tableName);

        return delRes;
    }

    async RunDb(): Promise<boolean> {
        return await this.db.RunDb();
    }

    abstract ConvertFrom(dbValue: any): ResponseDataPresentation;
    abstract ConvertTo(reqValue: RequestDataPresentation): ResponseDataPresentation;

}