import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentOrder } from '../models/models';
import { lastValueFrom } from 'rxjs';
import { PaymentStatus, PaypalResponse, SwipesStatus} from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {

  constructor(private http: HttpClient) { }

  private buySwipesApiUrl = '/api/protected/payment'

  private checkPaymentStatusApiUrl = '/api/protected/getpaymentstatus/'

  private addSwipesApiUrl = '/api/protected/addswipes'

  buySwipes(){
    const token = localStorage.getItem('token')
    const header = new HttpHeaders().set('Authorization', 'Bearer ' + token)
    const order: PaymentOrder = {
      price: 1.00,
      currency: 'SGD',
      method: 'paypal',
      intent: 'sale',
      description: 'string'
    }
    return lastValueFrom(this.http.post<PaypalResponse>(this.buySwipesApiUrl, order, {headers:header}))
  }

  checkPaymentStatus(paymentId: string){
    const token = localStorage.getItem('token')
    const header = new HttpHeaders().set('Authorization', 'Bearer ' + token)
    return lastValueFrom(this.http.get<PaymentStatus>(this.checkPaymentStatusApiUrl+paymentId, {headers:header}))
  }

  addSwipes(){
    const token = localStorage.getItem('token')
    const header = new HttpHeaders().set('Authorization', 'Bearer ' + token)
    return lastValueFrom(this.http.put<SwipesStatus>(this.addSwipesApiUrl, null, {headers:header}))
  }
}
