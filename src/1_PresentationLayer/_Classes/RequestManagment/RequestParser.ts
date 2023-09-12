import { Request } from "express"
import { Sorter, SorterType } from "../../../3_DataAccessLayer/_Classes/DataManagment/Sorter";
import { BlogSorter } from "../../../3_DataAccessLayer/Blogs/BlogSorter";
import { BlogResponse } from "../../../2_BusinessLogicLayer/_Classes/Data/BlogForResponse";
import { PageHandler } from "../../../3_DataAccessLayer/_Classes/DataManagment/PageHandler";
import { PostResponse } from "../../../2_BusinessLogicLayer/_Classes/Data/PostForResponse";
import { PostSorter } from "../../../3_DataAccessLayer/Posts/PostSorter";
import { UserResponse } from "../../../2_BusinessLogicLayer/_Classes/Data/UserForResponse";
import { UserSorter } from "../../../3_DataAccessLayer/Users/UserSorter";
import { Token } from "../../../2_BusinessLogicLayer/_Classes/Data/Token";
import { CommentSorter } from "../../../3_DataAccessLayer/Comments/CommentSorter";
import { CommentDataBase } from "../../../3_DataAccessLayer/_Classes/Data/CommentDB";
import { TOKEN_COOKIE_NAME } from "../../../settings";

export class RequestParser {
    static ReadQueryBlogSorter(request: Request): BlogSorter {
        let searchNameTerm = request.query.searchNameTerm as string | undefined;
        let sortBy: keyof BlogResponse & string | undefined = request.query.sortBy as keyof BlogResponse & string | undefined;
        let sortDirection: string | undefined = request.query.sortDirection as string | undefined;

        return new BlogSorter(
            SorterType.BlogSorter,
            searchNameTerm ? searchNameTerm : null,
            sortBy ? sortBy : "createdAt",
            sortDirection == "asc" || sortDirection == "desc" ? sortDirection : undefined
        )
    }
    static ReadQueryPostSorter(request: Request): Sorter<any> {
        let sortBy: keyof PostResponse & string | undefined = request.query.sortBy as keyof PostResponse & string | undefined;
        let sortDirection: string | undefined = request.query.sortDirection as string | undefined;

        return new PostSorter(
            SorterType.PostSorter,
            null,
            sortBy ? sortBy : "createdAt",
            sortDirection == "asc" || sortDirection == "desc" ? sortDirection : undefined
        )
    }
    static ReadQueryUserSorter(request: Request) {
        let sortBy: keyof UserResponse & string | undefined = request.query.sortBy as keyof UserResponse & string | undefined;
        let sortDirection: string | undefined = request.query.sortDirection as string | undefined;
        let searchLoginTerm: string | undefined = request.query.searchLoginTerm as string | undefined;
        let searchEmailTerm: string | undefined = request.query.searchEmailTerm as string | undefined;

        return new UserSorter(
            SorterType.UserSorter,
            searchLoginTerm ? searchLoginTerm : null,
            searchEmailTerm ? searchEmailTerm : null,
            sortBy ? sortBy : "createdAt",
            sortDirection == "asc" || sortDirection == "desc" ? sortDirection : undefined
        )

    }
    static ReadQueryCommentSorter(request: Request, postId: string | null) {
        let sortBy: keyof CommentDataBase & string | undefined = request.query.sortBy as keyof CommentDataBase & string | undefined;
        let sortDirection: string | undefined = request.query.sortDirection as string | undefined;


        return new CommentSorter(
            SorterType.CommentSorter,
            postId ? postId : null,
            sortBy ? sortBy : "createdAt",
            sortDirection == "asc" || sortDirection == "desc" ? sortDirection : undefined
        )

    }

    static ReadQueryPageHandle(request: Request): PageHandler {
        let strPageNumber = request.query.pageNumber as string;
        let strPageSize = request.query.pageSize as string;

        let pageNumber = Number.parseInt(strPageNumber);
        let pageSize = Number.parseInt(strPageSize);


        return new PageHandler(
            pageNumber,
            pageSize
        )
    }
    static ReadTokenFromBody(request: Request): Token | null {
        let headerString: string | undefined = request.header("authorization");

        if (headerString?.toLocaleLowerCase().startsWith("bearer ")) {
            let tokenString = headerString.split(" ")[1];
            let token: Token = {
                accessToken: tokenString
            }
            return token;
        }
        return null;

    }
    static ReadTokenFromCookie(request: any): Token | null {
        let token: Token = request.cookies[TOKEN_COOKIE_NAME];
        return token || null;

    }
}
