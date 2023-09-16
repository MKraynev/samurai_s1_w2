import { AdminAuthentication, IAuthenticator } from "../../../Common/Authentication/AdminAuthenticator";
import { AvailableDbTables, DataBase, ExecutionResult, ExecutionResultContainer } from "../../../Common/Database/DataBase";
import { AvailableInputDbTypes, AvailableReturnDbTypes, mongoDb } from "../../../Common/Database/MongoDb";
import { Page } from "../../../Common/Paginator/Page";
import { Paginator } from "../../../Common/Paginator/PageHandler";
import { BlogDataBase } from "../Entities/BlogForDataBase";
import { BlogResponse } from "../Entities/BlogForResponse";
import { BlogSorter } from "../Repo/BlogSorter";

export enum ServiseExecutionStatus {
    Unauthorized,
    DataBaseFailed,
    Success
}
type BlogServiceDto = ExecutionResultContainer<ExecutionResult,BlogResponse>;
type BlogServiceDtos = ExecutionResultContainer<ExecutionResult,BlogResponse[]>;

class BlogServise {
    private blogsTable = AvailableDbTables.blogs;

    constructor(private _db: DataBase<AvailableInputDbTypes, AvailableReturnDbTypes>, private _authenticator: IAuthenticator) { }

    public async GetBlogs(searchConfig: BlogSorter, paginator: Paginator): Promise<ExecutionResultContainer<ServiseExecutionStatus, Page<BlogResponse>| null>> {

        let countOperation = await this._db.Count(this.blogsTable, searchConfig);

        if (countOperation.executionStatus === ExecutionResult.Failed || countOperation.executionResultObject === null)
            return new ExecutionResultContainer(ServiseExecutionStatus.DataBaseFailed);

        let neededSkipObjectsNumber = paginator.GetAvailableSkip(countOperation.executionResultObject);
        let foundObjectsOperation = await this._db.GetMany(this.blogsTable, searchConfig, neededSkipObjectsNumber, paginator.pageSize) as BlogServiceDtos;

        if (foundObjectsOperation.executionStatus === ExecutionResult.Failed || !foundObjectsOperation.executionResultObject)
            return new ExecutionResultContainer(ServiseExecutionStatus.DataBaseFailed);


        let pagedObjects = paginator.GetPaged(foundObjectsOperation.executionResultObject);

        let operationResult = new ExecutionResultContainer(ServiseExecutionStatus.Success, pagedObjects)

        return operationResult;
    }

}

export const _blogService = new BlogServise(mongoDb, AdminAuthentication);