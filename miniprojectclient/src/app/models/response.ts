export interface Code{
    code: string
}

export interface UserID{
    userId: number
}

export interface AuthenticationResponse{
    token: string
    userID: number
}

export interface SQLResponse{
    rowsUpdated: number
}

export interface isProfileCompleted{
    profileCompleted: boolean
}

export interface SwipesStatus{
    swipes: number
}

export interface YesNo{
    response: string
}

export interface PaypalResponse{
    link: string
    paymentId: string
}

export interface PaymentStatus{
    paymentStatus: string
}



