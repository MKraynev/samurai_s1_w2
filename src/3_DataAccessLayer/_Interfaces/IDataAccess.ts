import { PageHandler } from "../_Classes/DataManagment/PageHandler";
import { Sorter } from "../_Classes/DataManagment/Sorter";
import { Paged } from "../_Types/Paged";

export interface IDataAccess<RequestDataPresentation, ResponseDataPresentation extends RequestDataPresentation> {
    TakeCertain(id: string): Promise<ResponseDataPresentation | null>;
    TakeAll(sorter?: Sorter<ResponseDataPresentation>, pageHandler?: PageHandler): Promise<Paged<ResponseDataPresentation[]> | null>;

    Post(reqObj: RequestDataPresentation): Promise<ResponseDataPresentation | null>;

}