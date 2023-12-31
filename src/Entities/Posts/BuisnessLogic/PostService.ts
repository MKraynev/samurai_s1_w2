import { AdminAuthentication, AuthenticationResult, IAuthenticator } from "../../../Common/Authentication/Admin/AdminAuthenticator";
import { AvailableDbTables, ExecutionResult, ExecutionResultContainer } from "../../../Common/Database/DataBase";
import { MongoDb, mongoDb } from "../../../Common/Database/MongoDb";
import { Page } from "../../../Common/Paginator/Page";
import { Paginator } from "../../../Common/Paginator/PageHandler";
import { ServiseExecutionStatus, blogService } from "../../Blogs/BuisnessLogic/BlogService";
import { CommentDataBase } from "../../Comments/Entities/CommentForDataBase";
import { CommentResponse } from "../../Comments/Entities/CommentForResponse";
import { CommentRequest } from "../../Comments/Entities/CommentRequest";
import { CommentResponseExtended } from "../../Comments/Entities/CommentResponseExtended";
import { CommentSorter } from "../../Comments/Repo/CommentSorter";
import { UserServiceExecutionResult, userService } from "../../Users/Common/BuisnessLogic/UserService";
import { Token } from "../../Users/Common/Entities/Token";
import { PostDataBase } from "../Entities/PostForDataBase";
import { PostRequest } from "../Entities/PostForRequest";
import { PostResponse } from "../Entities/PostForResponse";
import { PostSorter } from "../Repo/PostSorter";
import { Request } from "express"

type PostServiceDto = ExecutionResultContainer<ExecutionResult, PostResponse>;
type PostServiceDtos = ExecutionResultContainer<ExecutionResult, PostResponse[]>;

class PostService {
    private postsTable = AvailableDbTables.posts;
    private commentTable = AvailableDbTables.comments;

    constructor(private _db: MongoDb, private _authenticator: IAuthenticator) { }

    public async GetPosts(searchConfig: PostSorter, paginator: Paginator): Promise<ExecutionResultContainer<ServiseExecutionStatus, Page<PostResponse[]> | null>> {

        let countOperation = await this._db.Count(this.postsTable, searchConfig);

        if (countOperation.executionStatus === ExecutionResult.Failed || countOperation.executionResultObject === null)
            return new ExecutionResultContainer(ServiseExecutionStatus.DataBaseFailed);

        let neededSkipObjectsNumber = paginator.GetAvailableSkip(countOperation.executionResultObject);
        let foundObjectsOperation = await this._db.GetMany(this.postsTable, searchConfig, neededSkipObjectsNumber, paginator.pageSize) as PostServiceDtos;

        if (foundObjectsOperation.executionStatus === ExecutionResult.Failed || !foundObjectsOperation.executionResultObject)
            return new ExecutionResultContainer(ServiseExecutionStatus.DataBaseFailed);

        let pagedObjects = paginator.GetPaged<PostResponse[]>(foundObjectsOperation.executionResultObject);
        let operationResult = new ExecutionResultContainer(ServiseExecutionStatus.Success, pagedObjects)

        return operationResult;
    }
    public async GetPostById(id: string): Promise<ExecutionResultContainer<ServiseExecutionStatus, PostResponse | null>> {
        let foundObjectsOperation = await this._db.GetOneById(this.postsTable, id) as PostServiceDto;

        if (foundObjectsOperation.executionStatus === ExecutionResult.Failed) {
            return new ExecutionResultContainer(ServiseExecutionStatus.DataBaseFailed);
        }

        if (!foundObjectsOperation.executionResultObject)
            return new ExecutionResultContainer(ServiseExecutionStatus.NotFound);

        return new ExecutionResultContainer(ServiseExecutionStatus.Success, foundObjectsOperation.executionResultObject);
    }
    public async SavePost(post: PostRequest, request: Request<{}, {}, {}, {}>): Promise<ExecutionResultContainer<ServiseExecutionStatus, PostResponse | null>> {
        let searchBlog = await blogService.GetBlogById(post.blogId);
        if (searchBlog.executionStatus !== ServiseExecutionStatus.Success || !searchBlog.executionResultObject) {
            return new ExecutionResultContainer(ServiseExecutionStatus.NotFound);
        }

        let accessVerdict = this._authenticator.AccessCheck(request);

        if (accessVerdict !== AuthenticationResult.Accept)
            return new ExecutionResultContainer(ServiseExecutionStatus.Unauthorized);

        let postForSave = new PostDataBase(post);
        postForSave.blogName = searchBlog.executionResultObject.name;
        let saveOperation = await this._db.SetOne(this.postsTable, postForSave) as PostServiceDto;

        if (saveOperation.executionStatus === ExecutionResult.Failed || !saveOperation.executionResultObject) {
            return new ExecutionResultContainer(ServiseExecutionStatus.DataBaseFailed);
        }

        return new ExecutionResultContainer(ServiseExecutionStatus.Success, saveOperation.executionResultObject);
    }
    public async UpdatePost(id: string, post: PostRequest, request: Request<{}, {}, {}, {}>): Promise<ExecutionResultContainer<ServiseExecutionStatus, PostResponse | null>> {
        let searchBlog = await blogService.GetBlogById(post.blogId);

        if (searchBlog.executionStatus !== ServiseExecutionStatus.Success || !searchBlog.executionResultObject)
            return new ExecutionResultContainer(ServiseExecutionStatus.NotFound);

        let accessVerdict = this._authenticator.AccessCheck(request);

        if (accessVerdict !== AuthenticationResult.Accept)
            return new ExecutionResultContainer(ServiseExecutionStatus.Unauthorized);

        post.blogName = searchBlog.executionResultObject.name;
        let update = await this._db.UpdateOne(this.postsTable, id, post) as PostServiceDto;

        if (update.executionStatus === ExecutionResult.Failed)
            return new ExecutionResultContainer(ServiseExecutionStatus.DataBaseFailed);

        if (!update.executionResultObject)
            return new ExecutionResultContainer(ServiseExecutionStatus.NotFound);

        return new ExecutionResultContainer(ServiseExecutionStatus.Success, update.executionResultObject);
    }
    public async DeletePost(id: string, request: Request<{}, {}, {}, {}>): Promise<ExecutionResultContainer<ServiseExecutionStatus, boolean | null>> {
        let accessVerdict = this._authenticator.AccessCheck(request);

        if (accessVerdict !== AuthenticationResult.Accept)
            return new ExecutionResultContainer(ServiseExecutionStatus.Unauthorized);

        let deleteOperation = await this._db.DeleteOne(this.postsTable, id);

        if (deleteOperation.executionStatus === ExecutionResult.Failed)
            return new ExecutionResultContainer(ServiseExecutionStatus.DataBaseFailed);

        if (!deleteOperation.executionResultObject) {
            return new ExecutionResultContainer(ServiseExecutionStatus.NotFound);
        }

        return new ExecutionResultContainer(ServiseExecutionStatus.Success, true);
    }
    public async SaveComment(postId: string, userToken: Token, comment: CommentRequest): Promise<ExecutionResultContainer<ServiseExecutionStatus, CommentResponse | null>> {
        let findPost = await this.GetPostById(postId);
        if(findPost.executionStatus !== ServiseExecutionStatus.Success || !findPost.executionResultObject){
            return new ExecutionResultContainer(ServiseExecutionStatus.NotFound); 
        }

        let findUser = await userService.GetUserByToken(userToken);
        if(findUser.executionStatus !== UserServiceExecutionResult.Success || !findUser.executionResultObject){
            return new ExecutionResultContainer(ServiseExecutionStatus.Unauthorized);
        }

        let user = findUser.executionResultObject;

        let commentForSave = new CommentDataBase(comment, postId, user.login, user.id);
        let saveComment = await this._db.SetOne(this.commentTable, commentForSave) as ExecutionResultContainer<ExecutionResult, CommentResponse>;

        if(saveComment.executionStatus !== ExecutionResult.Pass || !saveComment.executionResultObject){
            return new ExecutionResultContainer(ServiseExecutionStatus.DataBaseFailed);
        }

        return new ExecutionResultContainer(ServiseExecutionStatus.Success, saveComment.executionResultObject);
    }
    public async GetPostComments(postId: string, sorter: CommentSorter, paginator: Paginator): Promise<ExecutionResultContainer<ServiseExecutionStatus, Page<CommentResponseExtended[]> | null>> {
        let findPost = await this.GetPostById(postId);
        if (findPost.executionStatus !== ServiseExecutionStatus.Success || !findPost.executionResultObject) {
            return new ExecutionResultContainer(ServiseExecutionStatus.NotFound);
        }

        let countAvailableComments = await this._db.Count(this.commentTable, sorter);
        if (countAvailableComments.executionStatus !== ExecutionResult.Pass || !countAvailableComments.executionResultObject)
            return new ExecutionResultContainer(ServiseExecutionStatus.DataBaseFailed);

        let availableCommuntsNumber = countAvailableComments.executionResultObject;
        let skip = paginator.GetAvailableSkip(availableCommuntsNumber);
        let getComments = await this._db.GetMany(this.commentTable, sorter, skip, paginator.pageSize) as ExecutionResultContainer<ExecutionResult, CommentResponse[]>

        if (getComments.executionStatus !== ExecutionResult.Pass || !getComments.executionResultObject)
            return new ExecutionResultContainer(ServiseExecutionStatus.DataBaseFailed);

        let comments = getComments.executionResultObject;
        
        let extendedComments: CommentResponseExtended[] = await Promise.all(comments.map(async (comment) => await comment.UpgradeToExtended()))
        

        let pagedObjects = paginator.GetPaged<CommentResponseExtended[]>(extendedComments);
        let operationResult = new ExecutionResultContainer(ServiseExecutionStatus.Success, pagedObjects)

        return operationResult;
    }
}

export const postService = new PostService(mongoDb, AdminAuthentication);