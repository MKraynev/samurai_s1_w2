import mongoose, { HydratedDocument } from "mongoose";
import { LikeDataBase, likeSchema } from "../Entities/LikeDataBase";
import { mongooseRepo } from "../../../Common/Mongoose/MongooseRepo";
import { ExecutionResult, ExecutionResultContainer } from "../../../Common/Database/DataBase";


export class LikeRepo {
    constructor(private like: mongoose.Model<LikeDataBase>) { }

    public async FindById(id: string) {
        return await this.like.find({ _id: id })
    }

    public async GetCurrentLikeStatus(like: LikeDataBase) {

    }
    public async Save(like: HydratedDocument<LikeDataBase>): Promise<ExecutionResultContainer<ExecutionResult, HydratedDocument<LikeDataBase>>> {
        try {
            await like.save();
            return new ExecutionResultContainer(ExecutionResult.Pass, like);

        }
        catch {
            return new ExecutionResultContainer(ExecutionResult.Failed);
        }

    }

    public async DeleteAll() {
        this.like.deleteMany({});
    }
    public async Get() {
        return this.like.find({});
    }

    public GetEntity = (like: LikeDataBase): HydratedDocument<LikeDataBase> => new this.like(like);
}

export const likeRepo = new LikeRepo(mongooseRepo.GetModel("Like", likeSchema))
