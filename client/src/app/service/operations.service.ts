import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Match, Profile, TextMatch } from '../models/models';
import { lastValueFrom } from 'rxjs';
import { SQLResponse, YesNo, isProfileCompleted, SwipesStatus } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class OperationsService {

  private completeProfileApiUrl = '/api/protected/completeprofile'

  private isProfileCompletedApiUrl = '/api/protected/isprofilecompleted'

  private getSwipeStatusApiUrl = '/api/protected/getswipestatus'

  private getMyProfileApiUrl = '/api/protected/getmyprofile'

  private updateProfileApiUrl = '/api/protected/updateprofile'

  private getProfilesApiUrl = '/api/protected/getprofiles'

  private swipeApiUrl = '/api/protected/swipe/'

  private getMatchesApiUrl = '/api/protected/getmatches'

  constructor(private http: HttpClient) { }

  completeProfile(profile: Profile){
    const formData = new FormData()
    formData.append('profilePic', profile.profilePic)
    formData.append('displayName', profile.displayName)
    formData.append('dateOfBirth', profile.dateOfBirth)
    formData.append('gender', profile.gender)
    formData.append('preference', profile.preference)
    const token = localStorage.getItem('token')
    const header = new HttpHeaders().set('Authorization', 'Bearer ' + token)
    return lastValueFrom(this.http.post<SQLResponse>(this.completeProfileApiUrl, formData, {headers: header}))
  }
  
  isProfileCompleted(){
    const token = localStorage.getItem('token')
    const header = new HttpHeaders().set('Authorization', 'Bearer ' + token)
    return lastValueFrom(this.http.get<isProfileCompleted>(this.isProfileCompletedApiUrl, {headers: header}))
  }

  getSwipeStatus(){
    const token = localStorage.getItem('token')
    const header = new HttpHeaders().set('Authorization', 'Bearer ' + token)
    return lastValueFrom(this.http.get<SwipesStatus>(this.getSwipeStatusApiUrl, {headers: header}))
  }

  getMyProfile(){
    const token = localStorage.getItem('token')
    const header = new HttpHeaders().set('Authorization', 'Bearer ' + token)
    return lastValueFrom(this.http.get<Match>(this.getMyProfileApiUrl, {headers:header}))
  }

  updateProfile(match: Match){
    const formData = new FormData()
    formData.append('profilePic', match.profilePic)
    formData.append('displayName', match.displayName)
    formData.append('dateOfBirth', match.dateOfBirth)
    formData.append('gender', match.gender)
    formData.append('preference', match.preference)
    const token = localStorage.getItem('token')
    const header = new HttpHeaders().set('Authorization', 'Bearer ' + token)
    return lastValueFrom(this.http.put<SQLResponse>(this.updateProfileApiUrl+'/'+match.id, formData, {headers: header}))
  }

  getProfiles(swipes: number){
    const token = localStorage.getItem('token')
    const header = new HttpHeaders().set('Authorization', 'Bearer ' + token)
    const param = new HttpParams().append('limit', swipes)
    return lastValueFrom(this.http.get<Match[]>(this.getProfilesApiUrl, {headers: header, params:param}))
  }

  swipe(targetUserID: number, yesno: string){
    const token = localStorage.getItem('token')
    const header = new HttpHeaders().set('Authorization', 'Bearer ' + token)
    const param = new HttpParams().append('yesno', yesno)
    return lastValueFrom(this.http.post<YesNo>(this.swipeApiUrl+targetUserID, null, {headers: header, params: param}))
  }

  getMatches(){
    const token = localStorage.getItem('token')
    const header = new HttpHeaders().set('Authorization', 'Bearer ' + token)
    return lastValueFrom(this.http.get<TextMatch[]>(this.getMatchesApiUrl, {headers:header}))
  }

  
}


