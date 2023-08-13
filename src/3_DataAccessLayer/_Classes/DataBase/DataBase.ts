export abstract class DataBase{
    abstract GetById(tableName: string, id: string): Promise<any | null>;
    abstract GetContaining(tableName: string, key: string, containingValue: string): Promise<any[] | null>;
    abstract GetAll(tableName: string): Promise<any[] | null>;

    abstract RunDb(): Promise<boolean>;
}