import { Page } from "./Page";

export class PageHandler {
    constructor(
        public pageNumber: number = 1,
        public pageSize: number = 10,
        public pagesCount: number = 0,
        public page: number = 0,
        public totalCount: number = 0
    ) {
        if ((!pageNumber) || pageNumber <= 0 || isNaN(pageNumber)) {
            this.pageNumber = 1;
        }
        if ((!pageSize)|| pageSize <= 0 || isNaN(pageSize)) {
            this.pageSize = 10;
        }
    }

    GetPaged(obj: Array<any>) {

        let { pageNumber, ...rest } = this;
        let pagedObj: Page<any> = {
            ...rest,
            items: obj
        }


        return pagedObj;
    }
}