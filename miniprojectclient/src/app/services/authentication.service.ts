import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Match } from '../models/models';
import { RegisterRequest, LoginRequest, ChangePasswordRequest } from '../models/request';
import { Code, AuthenticationResponse } from '../models/response';

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

  private forgetPasswordApiUrl = '/api/auth/resetpassword'

  private changePasswordApiUrl = '/api/changepassword'

  

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

  resetPassword(request: LoginRequest){
    return lastValueFrom(this.http.put<number>(this.forgetPasswordApiUrl, request))
  }

  changePassword(request: ChangePasswordRequest){
    const token = localStorage.getItem('token')
    const header = new HttpHeaders().set('Authorization', 'Bearer ' + token)
    return lastValueFrom(this.http.put<number>(this.changePasswordApiUrl, request, {headers:header}))
  }

}
