import { BlogResponse } from "../../2_BusinessLogicLayer/_Classes/Data/BlogForResponse";
import { Sorter, SorterType } from "../_Classes/DataManagment/Sorter";

export class BlogSorter extends Sorter<BlogResponse>{
    constructor(
        public sorterType: SorterType,
        public searchNameTerm: string | null = null,
        public sortBy: keyof BlogResponse & string = "createdAt",
        public sortDirection: "desc" | "asc" = "desc"
    ) {
        super(sortBy, sortDirection, sorterType)
    }
}