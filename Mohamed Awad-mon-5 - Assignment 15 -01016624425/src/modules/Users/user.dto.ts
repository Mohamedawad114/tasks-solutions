import { Gender, Sys_Role } from "../../common";

export interface SignUpDTO {
  username: string;
  phone: string;
  gender: Gender;
  role?: Sys_Role;
  DOB: Date;
  email: string;
  password: string;
}

export interface confirmEmailDTO {
  email: string;
  OTP: string;
}

export interface loginDTO {
  email: string;
  password: string;
}

export interface ResendOTPDTO {
  email: string;
}

export interface updateUserDTO {
  username?: string;
  phone?: string;
  DOB?: Date;
  email?: string;
  isConfirmed?: boolean;
  isPublic?: boolean;
}
export interface updatePasswordDTO {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
export interface ResetPasswordDTO {
  OTP: string;
  newPassword: string;
  confirmPassword: string;
}
