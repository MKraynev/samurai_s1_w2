import { AvailableDbTables } from "../../../Common/Database/DataBase";

export type AvailableLikeTarget = "comments";
export type AvailableLikeStatus = "Like" | "Dislike" | "None";

export class LikeRequest{
    constructor(
        public target: AvailableLikeTarget,
        public targetId: string,
        public status: AvailableLikeStatus
    ) {}
}