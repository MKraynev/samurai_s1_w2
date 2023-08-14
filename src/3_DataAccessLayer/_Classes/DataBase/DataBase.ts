import { Paged } from "../../_Types/Paged";
import { PageHandler } from "../DataManagment/PageHandler";
import { Sorter } from "../DataManagment/Sorter";

export abstract class DataBase {
    abstract GetById(tableName: string, id: string): Promise<any | null>;
    //abstract GetContaining(tableName: string, key: string, containingValue: string): Promise<Paged<any[]> | null>;
    abstract GetAll(tableName: string, sorter: Sorter<any>, pageHandler: PageHandler): Promise<[PageHandler, any[]]>;

    abstract Post(tableName: string, obj: any): Promise<any | null>;
    abstract Put(tableName: string, id: string, obj: any): Promise<any | null>;
    abstract Delete(tableName: string, id: string): Promise<any | null>;
    abstract DeleteAll(tableName: string): Promise<boolean>;

    abstract RunDb(): Promise<boolean>;
}