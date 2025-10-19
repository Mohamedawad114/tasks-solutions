
export interface IMeta{
    status: number,
    success:boolean
}
export interface IData{
        message: string,
        context?: object
}
export interface IError{
        message: string,
        context?: object
}
export interface IFailerResponse{
    meta: IMeta,
    error:IError
}
export interface ISuccessResponse{
    meta: IMeta,
    data:IData
}