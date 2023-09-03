import { WithId } from "mongodb";
import { BlogRequest } from "../../1_PresentationLayer/_Classes/Data/BlogForRequest";
import { BlogResponse } from "../../2_BusinessLogicLayer/_Classes/Data/BlogForResponse";
import { Repo } from "../_Classes/DataManagment/Repo/Repo"
import { BlogDataBase } from "../_Classes/Data/BlogDB";
import { CommentRequest, CommentRequestForDB } from "../../1_PresentationLayer/_Classes/Data/CommentRequest";
import { CommentDataBase } from "../_Classes/Data/CommentDB";
import { CommentResponse } from "../../2_BusinessLogicLayer/_Classes/Data/CommentForResponse";

export class CommentRepo extends Repo<CommentRequest,  CommentResponse | CommentDataBase>{
    ConvertFrom(dbValue: WithId<CommentDataBase>): CommentResponse {
        return new CommentResponse(dbValue._id, dbValue)
    }
    ConvertTo(reqContainer: CommentRequestForDB): CommentDataBase {
        return new CommentDataBase(new CommentRequest(reqContainer.content), reqContainer.PostId,  reqContainer.userLogin, reqContainer.userId);
    }
}