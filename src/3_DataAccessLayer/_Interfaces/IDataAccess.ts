import { PageHandler } from "../_Classes/DataManagment/PageHandler";
import { Sorter } from "../_Classes/DataManagment/Sorter";

export interface IDataAccess<RequestDataPresentation, ResponseDataPresentation extends RequestDataPresentation> {
    TakeCertain(id: string): Promise<ResponseDataPresentation | null>;
    TakeAll(sorter?: Sorter, pageHandler?: PageHandler): Promise<ResponseDataPresentation[] | null>;
    //Принимает ключ, подстроку значения ключа, сортировщик и управление страницами
    TakeByKey<Key extends keyof ResponseDataPresentation>(k: Key , val: string, sorter?: Sorter, pageHandler?: PageHandler): Promise<ResponseDataPresentation[]| null>;

    
}