import { ResponseBlogData } from "../../../../_legacy/Repos/Entities/Blog";
import { IDataAccess } from "../../../_Interfaces/IDataAccess";
import { Paged } from "../../../_Types/Paged";
import { DataBase } from "../../DataBase/DataBase";
import { PageHandler } from "../PageHandler";
import { Sorter } from "../Sorter";

export abstract class Repo<RequestDataPresentation, ResponseDataPresentation extends RequestDataPresentation>
    implements IDataAccess<RequestDataPresentation, ResponseDataPresentation>{


    constructor(private db: DataBase, private tableName: string) { }


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
            let returnValues = dbData.map(dbVal => this.ConvertTo(dbVal))
            let pagedData = dbHandler.GetPaged(returnValues);
            return pagedData;
        }
        return null;
    }



    async Post(reqObj: RequestDataPresentation): Promise<ResponseDataPresentation | null> {
        let dataForDb = this.ConvertTo(reqObj);
        let saveResult = await this.db.Post(this.tableName, dataForDb);
        let returnResult = this.ConvertFrom(saveResult);
        return returnResult;
    }


    async RunDb(): Promise<boolean> {
        return await this.db.RunDb();
    }

    abstract ConvertFrom(dbValue: any): ResponseDataPresentation;
    abstract ConvertTo(reqValue: RequestDataPresentation): ResponseDataPresentation;

}