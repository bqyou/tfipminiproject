export interface RegisterRequest{
    email: string,
    password: string
}

export interface LoginRequest{
    email: string,
    password: string
}

export interface ChangePasswordRequest{
    oldPassword:string
    newPassword:string
}