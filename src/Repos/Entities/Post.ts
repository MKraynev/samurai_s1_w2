export class Post {
    constructor(
        public title: string = "",
        public shortDescription: string = "",
        public content: string = "",
        public blogId: string = "",
        public createdAt: string = "",
        public isMembership: boolean = false
    ) { }
}


// let posts = [
//     new PostData("Бесконечность не предел", "космос", "бла бла бла бла бла", "12S_43F"),
//     new PostData("Кухни мира", "еда", "бла бла бла бла бла бла", "54M_06K")
// ]
