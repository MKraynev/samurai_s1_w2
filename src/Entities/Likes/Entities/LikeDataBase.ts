import { LikeRequest } from "./LikeRequest";

export class LikeDataBase extends LikeRequest {
    constructor(public userId: string, likeData: LikeRequest) {
        super(likeData.target, likeData.targetId, likeData.status)
    }
}