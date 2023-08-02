class ErrorMessage {
    constructor(public message: string, public field: string) {
    }
}

export class ErrorLog{
    readonly errorsMessages: ErrorMessage[] = []
    public add = (field: string, description: string) =>{
        this.errorsMessages.push(new ErrorMessage(description, field));
    }
}
