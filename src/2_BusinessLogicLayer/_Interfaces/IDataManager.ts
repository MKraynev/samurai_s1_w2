import { PageHandler } from "../../3_DataAccessLayer/_Classes/DataManagment/PageHandler";
import { Sorter } from "../../3_DataAccessLayer/_Classes/DataManagment/Sorter";

export interface IDataManager<RequestDataPresentation, ResponseDataPresentation extends RequestDataPresentation> {
    GetData (filter: keyof RequestDataPresentation, filterValue: string, sorter: Sorter, pageHandler: PageHandler): RequestDataPresentation[] | null;
    
    GetCertainData(id: string, sorter: Sorter, pageHandler: PageHandler): RequestDataPresentation | null;

    PostData (reqObj: RequestDataPresentation): ResponseDataPresentation | null;

    PutData(reqObj: RequestDataPresentation): ResponseDataPresentation | null;

    DeleteData(): ResponseDataPresentation;
}