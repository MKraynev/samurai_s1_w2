import { Paginator } from "../Paginator/PageHandler";
import { Sorter } from "./Sort/Sorter";

export enum ExecutionResult {
    Failed,
    Pass
}

export class ExecutionResultContainer<ExecutionStatusType, ExecutionResultObjectType> {
    constructor(
        public executionStatus: ExecutionStatusType,
        public executionResultObject: ExecutionResultObjectType | null = null,
        public message: string | null = null) { }

}

export enum AvailableDbTables {
    blogs = "blogs",
    posts = "posts",
    users = "users",
    comments = "comments"
}

export abstract class DataBase<SaveObject, ReturnObject> {
    abstract GetOneById(tableName: AvailableDbTables, id: string): Promise<ExecutionResultContainer<ExecutionResult, ReturnObject>>;
    abstract GetOneByValueInOnePropery(tableName: AvailableDbTables, propertyName: keyof(SaveObject), propVal: string): Promise<ExecutionResultContainer<ExecutionResult, ReturnObject>>;
    abstract GetOneByValueInTwoProperties(tableName: AvailableDbTables, propertyName_1: keyof(SaveObject), propertyName_2: keyof(SaveObject), propVal: string): Promise<ExecutionResultContainer<ExecutionResult, ReturnObject>>;
    abstract GetMany(tableName: AvailableDbTables, sorter: Sorter<any>, skip: number, maxTake: number): Promise<ExecutionResultContainer<ExecutionResult, Array<ReturnObject>>>;

    abstract SetOne(tableName: AvailableDbTables, setObject: SaveObject): Promise<ExecutionResultContainer<ExecutionResult, ReturnObject>>;

    abstract UpdateOne(tableName: AvailableDbTables, id: string, updateObject: SaveObject): Promise<ExecutionResultContainer<ExecutionResult, ReturnObject>>;
    abstract UpdateOneProperty(tableName: AvailableDbTables, id: string, propertyName: keyof(SaveObject), value: string | boolean | number): Promise<ExecutionResultContainer<ExecutionResult, ReturnObject>>;
    abstract AppendOneProperty(tableName: AvailableDbTables, id: string, propertyName: keyof(SaveObject), value: string | boolean | number): Promise<ExecutionResultContainer<ExecutionResult, ReturnObject>>;

    abstract DeleteOne(tableName: AvailableDbTables, id: string): Promise<ExecutionResultContainer<ExecutionResult, boolean>>;
    abstract DeleteAll(tableName: AvailableDbTables): Promise<ExecutionResultContainer<ExecutionResult, boolean>>;

    abstract Count(tableName: AvailableDbTables, sorter: Sorter<any>): Promise<ExecutionResultContainer<ExecutionResult, number>>;
    abstract RunDb(): Promise<ExecutionResultContainer<ExecutionResult, boolean>>;
}