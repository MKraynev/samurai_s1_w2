import { PageHandler } from "../Repo/Paginator/PageHandler";
import { Sorter } from "../Repo/Sort/Sorter";

export interface IDataManager<RequestDataPresentation, ResponseDataPresentation extends RequestDataPresentation> {
    GetData (filter: keyof RequestDataPresentation, filterValue: string, sorter: Sorter<ResponseDataPresentation>, pageHandler: PageHandler): RequestDataPresentation[] | null;
    
    GetCertainData(id: string, sorter: Sorter<ResponseDataPresentation>, pageHandler: PageHandler): RequestDataPresentation | null;

    PostData (reqObj: RequestDataPresentation): ResponseDataPresentation | null;

    PutData(reqObj: RequestDataPresentation): ResponseDataPresentation | null;

    DeleteData(): ResponseDataPresentation;
}