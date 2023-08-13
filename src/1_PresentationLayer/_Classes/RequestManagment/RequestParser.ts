import { Request } from "express"
import { Sorter } from "../../../3_DataAccessLayer/_Classes/DataManagment/Sorter";
import { BlogSorter } from "../../../3_DataAccessLayer/Blogs/BlogSorter";
import { BlogResponse } from "../../../2_BusinessLogicLayer/_Classes/Data/BlogForResponse";
import { PageHandler } from "../../../3_DataAccessLayer/_Classes/DataManagment/PageHandler";

export class RequestParser {
    static ReadQueryBlogSorter(request: Request): BlogSorter {
        let searchNameTerm = request.query.searchNameTerm as string | undefined;
        let sortBy: keyof BlogResponse & string | undefined = request.query.sortBy as keyof BlogResponse & string | undefined;
        let sortDirection: string | undefined = request.query.sortDirection as string | undefined;

        return new BlogSorter(
            searchNameTerm? searchNameTerm : null,
            sortBy? sortBy: "createdAt",
            sortDirection == "asc" || sortDirection == "desc"? sortDirection : undefined
        )
    }

    static ReadQueryPageHandle(request: Request): PageHandler{
        let strPageNumber = request.query.pageNumber as string | undefined;
        let strPageSize = request.query.pageSize as string;
        let pageNumber = Number.parseInt(strPageNumber?strPageNumber : "");
        let pageSize = Number.parseInt(strPageSize?strPageSize : "");

        return new PageHandler(
            isNaN(pageNumber)? undefined: pageNumber,
            isNaN(pageSize)? undefined: pageSize
        )
    }
    

}
