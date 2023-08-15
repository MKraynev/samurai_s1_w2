import { PostResponse } from "../../2_BusinessLogicLayer/_Classes/Data/PostForResponse";
import { Sorter, SorterType } from "../_Classes/DataManagment/Sorter";

export class PostSorter extends Sorter<PostResponse>{
    constructor(
        public sorterType: SorterType,
        public searchBlogId: string | null = null,
        public sortBy: keyof PostResponse & string = "createdAt",
        public sortDirection: "desc" | "asc" = "desc"
    ) {
        super(sortBy, sortDirection, sorterType)
    }
}