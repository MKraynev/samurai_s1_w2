import { CommentResponse } from "../../2_BusinessLogicLayer/_Classes/Data/CommentForResponse";
import { CommentDataBase } from "../_Classes/Data/CommentDB";
import { Sorter, SorterType } from "../_Classes/DataManagment/Sorter";

export class CommentSorter extends Sorter<CommentDataBase>{
    constructor(
        public sorterType: SorterType,
        public postId: string | null,
        public sortBy: keyof CommentDataBase & string = "createdAt",
        public sortDirection: "desc" | "asc" = "desc"
    ) {
        super(sortBy, sortDirection, sorterType)
    }
}