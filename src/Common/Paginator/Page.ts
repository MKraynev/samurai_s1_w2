export class Page<T>{
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: Array<T> | null
    ) { }

}
