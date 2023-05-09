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

export interface premiumAndSwipesStatus{
    swipes: number
    isPremium: boolean
}

export interface YesNo{
    response: string
}

