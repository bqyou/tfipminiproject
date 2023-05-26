export interface Signup{
    email: string,
    password: string
}

export interface Profile {
    displayName: string,
    dateOfBirth: string,
    gender: string,
    preference: string,
    profilePic: File,
    aboutMe: string
}

export interface Match {
    id: number
    displayName: string
    dateOfBirth: string
    gender: string
    preference: string
    profilePic: string
    aboutMe: string
    age: number | null
}

export interface TextMatch {
    id: number
    displayName: string
    profilePic: string
}

export interface Messages {
    senderId: number
    receiverId: number
    message: string
}

export interface PaymentOrder{
    price: number
    currency: string
    method: string
    intent: string
    description: string
}