import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Match, Profile, Signup } from '../models/models';
import { lastValueFrom } from 'rxjs';
import { AuthenticationResponse, Code, SQLResponse, UserID, isProfileCompleted } from '../models/response';
import { LoginRequest, RegisterRequest } from '../models/request';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private code!: string

  private email!: string

  private password!: string

  private userID!: number

  private profile!: Match

  setProfile(match: Match){
    this.profile = match
  }

  getProfile(){
    return this.profile
  }

  setUserID(userID: number){
    this.userID = userID;
  }

  getUserID(){
    return this.userID
  }

  setEmail(email: string){
    this.email = email
  }

  getEmail(){
    return this.email
  }

  setPassword(password: string){
    this.password = password
  }
  
  getPassword(){
    return this.password
  }

  setCode(code: string){
    this.code = code
  }

  getCode(){
    return this.code
  }

  private getVerificationApiUrl = '/api/auth/verifyemail'

  private registerUserApiUrl = '/api/auth/register'

  private loginUserApiUrl = '/api/auth/login'

  

  constructor(private http: HttpClient) { }

  getVerificationCode(request: RegisterRequest){
    return lastValueFrom(this.http.post<Code>(this.getVerificationApiUrl, request))
  }

  registerUser(request: RegisterRequest){   
    return lastValueFrom(this.http.post<AuthenticationResponse>(this.registerUserApiUrl, request))
  }

  login(request: LoginRequest){
    return lastValueFrom(this.http.post<AuthenticationResponse>(this.loginUserApiUrl, request))
  }

  
}
