import { GENDER_USER, SYS_role } from "../../utils/Enums/user.enums";

export interface RegisterDTO {
        Name:string,
        email:string,
        phone?:string,
        age:number,
        password:string,
        gender:GENDER_USER,
        role?:SYS_role
    } 

export interface UpdateUserDTO extends Partial <RegisterDTO>{}

export interface LoginDTO {
        password:string,
        email:string,
}
export interface ConfirmOTPDTO {
        OTP:string,
        email:string,
}
export interface EmailDTO {
        email:string,
}
