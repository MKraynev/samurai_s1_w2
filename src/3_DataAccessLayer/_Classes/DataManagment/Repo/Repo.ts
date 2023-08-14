import { ResponseBlogData } from "../../../../_legacy/Repos/Entities/Blog";
import { IDataAccess } from "../../../_Interfaces/IDataAccess";
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

    async TakeAll(sorter: Sorter<ResponseDataPresentation>, pageHandler: PageHandler): Promise<ResponseDataPresentation[] | null> {
        let foundDbValues = await this.db.GetAll(this.tableName, sorter, pageHandler);
        if (foundDbValues) {
            let returnValues = foundDbValues.map(dbVal => this.ConvertTo(dbVal))
            return returnValues;
        }
        return null;
    }

    async TakeByKey(k: keyof ResponseDataPresentation, val: string, sorter?: Sorter<ResponseDataPresentation> | undefined, pageHandler?: PageHandler | undefined): Promise<ResponseDataPresentation[] | null> {
        let strKey = k.toString();
        let suitableDbValues = await this.db.GetContaining(this.tableName, strKey, val);
        if (suitableDbValues) {
            return suitableDbValues.map(dbVal => this.ConvertTo(dbVal))
        }
        return null;
    }
    
    async Post(reqObj: RequestDataPresentation): Promise<ResponseDataPresentation | null> {
        let dataForDb = this.ConvertTo(reqObj);
        let saveResult = await this.db.Post(this.tableName, dataForDb);
        let returnResult = this.ConvertFrom(saveResult);
        return returnResult;
    }

    
    async RunDb(): Promise<boolean>{
        return await this.db.RunDb();
    }
    
    abstract ConvertFrom(dbValue: any): ResponseDataPresentation;
    abstract ConvertTo(reqValue: RequestDataPresentation): ResponseDataPresentation;
    
}