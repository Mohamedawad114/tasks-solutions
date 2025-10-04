import { IFailerResponse, ISuccessResponse } from "../../common"

export function FailerResponse(
    message = "failed response",
    status = 500,
    error?: Object
):IFailerResponse {
    return {
        meta: {
            status: status,
            success:false
        },
        error: {
            message: message,
            context: error
        }
    }
}
export function SuccessResponse(
    message = "success response progress",
    status = 200,
    data?: Object
):ISuccessResponse{
    return {
        meta: {
            status: status,
            success:true
        },
        data: {
            message: message,
            context: data
        }
    }
}