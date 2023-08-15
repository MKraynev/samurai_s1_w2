import { Paged } from "../../_Types/Paged";

export class PageHandler {
    constructor(
        public pageNumber: number = 1,
        public pageSize: number = 10,
        public pagesCount: number = 0,
        public page: number = 0,
        public totalCount: number = 0
    ) {
        if (!pageNumber || pageNumber <= 0) {
            pageNumber = 1;
        }
        if (!pageSize || pageSize <= 0) {
            pageSize = 10;
        }
    }

    GetPaged(obj: Array<any>) {

        let { pageNumber, ...rest } = this;
        let pagedObj: Paged<any> = {
            ...rest,
            items: obj
        }


        return pagedObj;
    }
}