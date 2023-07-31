class ErrorMessage {
    constructor(public message: string, public field: string) {
    }
}

export class ErrorLog{
    errors: ErrorMessage[] = []
    public add = (field: string, description: string) =>{
        this.errors.push(new ErrorMessage(description, field));
    }
}
