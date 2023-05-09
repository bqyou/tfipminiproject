export interface Signup{
    email: string,
    password: string
}

export interface Profile {
    displayName: string,
    dateOfBirth: string,
    gender: string,
    preference: string,
    profilePic: File
}

export interface Match {
    id: number
    displayName: string
    dateOfBirth: string
    gender: string
    preference: string
    profilePic: string
    age: number
}

export interface TextMatch {
    id: number
    displayName: string
}