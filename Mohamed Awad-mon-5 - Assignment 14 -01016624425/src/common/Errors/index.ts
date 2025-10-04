export  class AppError extends Error{
    constructor(message:string,public statusCode:number,public error?:Object){
        super(message)
    }
}


export class conflictException extends AppError{
    constructor(message:string,public error?:Object){
        super(message,409,error)
    }

}
export class notFoundException extends AppError{
    constructor(message:string,public error?:Object){
        super(message,404,error)
    }

}
export class BadRequestException extends AppError{
    constructor(message:string,public error?:Object){
        super(message,400,error)
    }

}
export class notAuthorizedException extends AppError{
    constructor(message:string,public  error?:Object){
        super(message,401,error)
    }


}
