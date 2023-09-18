import { Request } from "express"
import { AdminAuthentication, AuthenticationResult, IAuthenticator } from "../../../Common/Authentication/Admin/AdminAuthenticator";
import { AvailableDbTables, DataBase, ExecutionResult, ExecutionResultContainer } from "../../../Common/Database/DataBase";
import { MongoDb, mongoDb } from "../../../Common/Database/MongoDb";
import { Page } from "../../../Common/Paginator/Page";
import { Paginator } from "../../../Common/Paginator/PageHandler";
import { BlogRequest } from "../Entities/BlogForRequest";
import { BlogResponse } from "../Entities/BlogForResponse";
import { BlogSorter } from "../Repo/BlogSorter";
import { BlogDataBase } from "../Entities/BlogForDataBase";

export enum ServiseExecutionStatus {
    Unauthorized,
    DataBaseFailed,
    Success,
    NotFound
}
type BlogServiceDto = ExecutionResultContainer<ExecutionResult, BlogResponse>;
type BlogServiceDtos = ExecutionResultContainer<ExecutionResult, BlogResponse[]>;

class BlogServise {
    private blogsTable = AvailableDbTables.blogs;

    constructor(private _db: MongoDb, private _authenticator: IAuthenticator) { }

    public async GetBlogs(searchConfig: BlogSorter, paginator: Paginator): Promise<ExecutionResultContainer<ServiseExecutionStatus, Page<BlogResponse> | null>> {

        let countOperation = await this._db.Count(this.blogsTable, searchConfig);

        if (countOperation.executionStatus === ExecutionResult.Failed || countOperation.executionResultObject === null)
            return new ExecutionResultContainer(ServiseExecutionStatus.DataBaseFailed);

        let neededSkipObjectsNumber = paginator.GetAvailableSkip(countOperation.executionResultObject);
        let foundObjectsOperation = await this._db.GetMany(this.blogsTable, searchConfig, neededSkipObjectsNumber, paginator.pageSize) as BlogServiceDtos;

        if (foundObjectsOperation.executionStatus === ExecutionResult.Failed)
            return new ExecutionResultContainer(ServiseExecutionStatus.DataBaseFailed);

        let pagedObjects = paginator.GetPaged(foundObjectsOperation.executionResultObject);
        let operationResult = new ExecutionResultContainer(ServiseExecutionStatus.Success, pagedObjects)

        return operationResult;
    }
    public async GetBlogById(id: string): Promise<ExecutionResultContainer<ServiseExecutionStatus, BlogResponse | null>> {
        let foundObjectsOperation = await this._db.GetOneById(this.blogsTable, id) as BlogServiceDto;

        if (foundObjectsOperation.executionStatus === ExecutionResult.Failed) {
            return new ExecutionResultContainer(ServiseExecutionStatus.DataBaseFailed);
        }

        if (!foundObjectsOperation.executionResultObject)
            return new ExecutionResultContainer(ServiseExecutionStatus.NotFound);

        return new ExecutionResultContainer(ServiseExecutionStatus.Success, foundObjectsOperation.executionResultObject);
    }
    public async SaveBlog(blog: BlogRequest, request: Request<{}, {}, {}, {}>): Promise<ExecutionResultContainer<ServiseExecutionStatus, BlogResponse | null>> {
        let accessVerdict = this._authenticator.AccessCheck(request);

        if (accessVerdict !== AuthenticationResult.Accept)
            return new ExecutionResultContainer(ServiseExecutionStatus.Unauthorized);

        let blogForSave = new BlogDataBase(blog);
        let saveOperation = await this._db.SetOne(this.blogsTable, blogForSave) as BlogServiceDto;

        if (saveOperation.executionStatus === ExecutionResult.Failed || !saveOperation.executionResultObject) {
            return new ExecutionResultContainer(ServiseExecutionStatus.DataBaseFailed);
        }

        return new ExecutionResultContainer(ServiseExecutionStatus.Success, saveOperation.executionResultObject);
    }
    public async UpdateBlog(id: string, blog: BlogRequest, request: Request<{}, {}, {}, {}>): Promise<ExecutionResultContainer<ServiseExecutionStatus, BlogResponse | null>> {
        let accessVerdict = this._authenticator.AccessCheck(request);

        if (accessVerdict !== AuthenticationResult.Accept)
            return new ExecutionResultContainer(ServiseExecutionStatus.Unauthorized);

        let update = await this._db.UpdateOne(this.blogsTable, id, blog) as BlogServiceDto;

        if (update.executionStatus === ExecutionResult.Failed)
            return new ExecutionResultContainer(ServiseExecutionStatus.DataBaseFailed);

        if (!update.executionResultObject)
            return new ExecutionResultContainer(ServiseExecutionStatus.NotFound);


        return new ExecutionResultContainer(ServiseExecutionStatus.Success, update.executionResultObject);
    }
    public async DeleteBlog(id: string, request: Request<{}, {}, {}, {}>): Promise<ExecutionResultContainer<ServiseExecutionStatus, boolean | null>> {
        let accessVerdict = this._authenticator.AccessCheck(request);

        if (accessVerdict !== AuthenticationResult.Accept)
            return new ExecutionResultContainer(ServiseExecutionStatus.Unauthorized);

        let deleteOperation = await this._db.DeleteOne(this.blogsTable, id);

        if (deleteOperation.executionStatus === ExecutionResult.Failed)
            return new ExecutionResultContainer(ServiseExecutionStatus.DataBaseFailed);

        if (!deleteOperation.executionResultObject) {
            return new ExecutionResultContainer(ServiseExecutionStatus.NotFound);
        }

        return new ExecutionResultContainer(ServiseExecutionStatus.Success, true);
    }
}

export const blogService = new BlogServise(mongoDb, AdminAuthentication);