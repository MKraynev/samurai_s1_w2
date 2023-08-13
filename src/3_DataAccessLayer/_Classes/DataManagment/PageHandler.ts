export class PageHandler{
    constructor(
        readonly pageNumber: number = 1,
        readonly pageSize: number = 10
    ){
        if(pageNumber <= 0){
            pageNumber = 1;
        }
        if(pageSize <= 0){
            pageSize = 10;
        }
    }
}