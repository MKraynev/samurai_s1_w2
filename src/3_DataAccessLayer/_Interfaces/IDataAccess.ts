import { PageHandler } from "../_Classes/DataManagment/PageHandler";
import { Sorter } from "../_Classes/DataManagment/Sorter";
import { Paged } from "../_Types/Paged";

export interface IDataAccess<RequestDataPresentation, ResponseDataPresentation> {
    TakeCertain(id: string): Promise<ResponseDataPresentation | null>;
    TakeAll(sorter?: Sorter<ResponseDataPresentation>, pageHandler?: PageHandler): Promise<Paged<ResponseDataPresentation[]> | null>;

    Save(reqObj: RequestDataPresentation): Promise<ResponseDataPresentation | null>;
    Update(id: string, reqObj: RequestDataPresentation): Promise<ResponseDataPresentation | null>;
    DeleteCertain(id: string): Promise<boolean>;
    DeleteMany(): Promise<boolean>;
}