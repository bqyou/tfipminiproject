import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { PaymentOrder } from '../models/models';
import { PaypalResponse, PaymentStatus, SwipesStatus } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {

  constructor(private http: HttpClient) { }

  private buySwipesApiUrl = '/api/payment'

  private checkPaymentStatusApiUrl = '/api/payment/getpaymentstatus/'

  private addSwipesApiUrl = '/api/protected/addswipes'

  private successApiUrl = '/pay/success'

  buySwipes(){
    const token = localStorage.getItem('token')
    const header = new HttpHeaders().set('Authorization', 'Bearer ' + token)
    const order: PaymentOrder = {
      price: 1.00,
      currency: 'SGD',
      method: 'paypal',
      intent: 'sale',
      description: '10 swipes'
    }
    return lastValueFrom(this.http.post<PaypalResponse>(this.buySwipesApiUrl, order, {headers:header}))
  }

  executePayment(paymentId: string, token: string, payerId: string){
    const jwtToken = localStorage.getItem('token')
    const header = new HttpHeaders().set('Authorization', 'Bearer ' + jwtToken)
    const params = new HttpParams()
                      .append('paymentId', paymentId)
                      .append('token', token)
                      .append('PayerID', payerId)
    return lastValueFrom(this.http.get<PaymentStatus>(this.successApiUrl, {headers: header, params:params}))
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
