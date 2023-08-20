import { BlogResponse } from "../../2_BusinessLogicLayer/_Classes/Data/BlogForResponse";
import { UserResponse } from "../../2_BusinessLogicLayer/_Classes/Data/UserForResponse";
import { Sorter, SorterType } from "../_Classes/DataManagment/Sorter";

export class UserSorter extends Sorter<UserResponse>{
    constructor(
        public sorterType: SorterType,
        public searchLoginTerm: string | null = null,
        public searchEmailTerm: string | null = null,
        public sortBy: keyof UserResponse & string = "createdAt",
        public sortDirection: "desc" | "asc" = "desc"
    ) {
        super(sortBy, sortDirection, sorterType)
    }
}