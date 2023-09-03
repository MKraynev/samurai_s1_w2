import { WithId } from "mongodb";
import { BlogRequest } from "../../1_PresentationLayer/_Classes/Data/BlogForRequest";
import { BlogResponse } from "../../2_BusinessLogicLayer/_Classes/Data/BlogForResponse";
import { Repo } from "../_Classes/DataManagment/Repo/Repo"
import { BlogDataBase } from "../_Classes/Data/BlogDB";
import { CommentRequest, CommentRequestForDB } from "../../1_PresentationLayer/_Classes/Data/CommentRequest";
import { CommentDataBase } from "../_Classes/Data/CommentDB";
import { CommentResponse } from "../../2_BusinessLogicLayer/_Classes/Data/CommentForResponse";

export enum DeleteResult{
    Deleted,
    NotFound,
    WrongUser
}
export enum UpdateResult{
    Updated,
    NotFound,
    WrongUser
}

export class CommentRepo extends Repo<CommentRequest,  CommentResponse | CommentDataBase>{
    ConvertFrom(dbValue: WithId<CommentDataBase>): CommentResponse {
        return new CommentResponse(dbValue._id, dbValue)
    }
    ConvertTo(reqContainer: CommentRequestForDB): CommentDataBase {
        return new CommentDataBase(new CommentRequest(reqContainer.content), reqContainer.PostId,  reqContainer.userLogin, reqContainer.userId);
    }

    async DeleteCertainWithUserCheck(id: string, userId: string): Promise<DeleteResult> {
        let comment = await this.TakeCertain(id);
        
        if(!comment) return DeleteResult.NotFound;
        if(comment.commentatorInfo.userId != userId) return DeleteResult.WrongUser;

        let commentDeleted = await this.db.Delete(this.tableName, id);
        return commentDeleted? DeleteResult.Deleted : DeleteResult.NotFound;
    }

    async UpdateWitchUserCheck(id: string, userId: string, regObj: CommentRequest): Promise<UpdateResult>{
        let comment = await this.TakeCertain(id);
        
        if(!comment) return UpdateResult.NotFound;
        if(comment.commentatorInfo.userId != userId) return UpdateResult.WrongUser;

        let commentUpdated = await this.db.Put(this.tableName, id, regObj);
        return commentUpdated? UpdateResult.Updated : UpdateResult.NotFound;
    }
}