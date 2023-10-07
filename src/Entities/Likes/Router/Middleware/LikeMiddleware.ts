import { body } from "express-validator";
import { FieldNotEmpty } from "../../../../Common/Request/RequestValidation/RequestValidation";
import { AvailableLikeStatus } from "../../Entities/LikeRequest";

let availableValues: AvailableLikeStatus[] = ["Dislike", "Like", "None"];
export const ValidLikeFields = [
    FieldNotEmpty("likeStatus"),
    body("likeStatus").isIn(availableValues).withMessage(`Wrong likeStatus value: likeStatus`)
]