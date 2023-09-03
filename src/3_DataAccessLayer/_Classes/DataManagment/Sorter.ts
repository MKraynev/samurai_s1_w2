import { BlogResponse } from "../../../2_BusinessLogicLayer/_Classes/Data/BlogForResponse";

export class Sorter<T>{
    constructor(
        public sortBy: keyof T | string = "createdAt",
        public sortDirection: "desc" | "asc" = "desc",
        public type: SorterType
    ) { }
}

export enum SorterType {
    BlogSorter,
    PostSorter,
    UserSorter,
    CommentSorter
}