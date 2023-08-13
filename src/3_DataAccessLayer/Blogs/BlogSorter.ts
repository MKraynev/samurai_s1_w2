import { BlogResponse } from "../../2_BusinessLogicLayer/_Classes/Data/BlogForResponse";
import { Sorter } from "../_Classes/DataManagment/Sorter";

export class BlogSorter extends Sorter<BlogResponse>{
    constructor(
        public searchNameTerm: string | null = null,
        sortBy: keyof BlogResponse & string = "createdAt",
        sortDirection: "desc" | "asc" = "desc"
    ){
        super(sortBy, sortDirection)
    }
}