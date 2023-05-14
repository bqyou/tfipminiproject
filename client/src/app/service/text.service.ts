import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Messages, TextMatch } from '../models/models';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TextService {

  constructor(private http: HttpClient) { }

  private getChatHistoryApiUrl = '/api/protected/getchathistory'

  private sendMessageApiUrl = '/api/protected/sendmessage'

  private targetUserToText!: TextMatch

  setTargetUserToText(textMatch: TextMatch){
    this.targetUserToText = textMatch
  }

  getTargetUserToText(){
    return this.targetUserToText
  }

  getChatHistory(targetUserId: number){
    const token = localStorage.getItem('token')
    const header = new HttpHeaders().set('Authorization', 'Bearer ' + token)
    return lastValueFrom(this.http.get<Messages[]>(this.getChatHistoryApiUrl+"/"+targetUserId, {headers:header}))
  }

  sendMessage(message: Messages){
    const token = localStorage.getItem('token')
    const header = new HttpHeaders().set('Authorization', 'Bearer ' + token)
    return lastValueFrom(this.http.post<Messages[]>(this.sendMessageApiUrl, message, {headers:header}))
  }



  
}
