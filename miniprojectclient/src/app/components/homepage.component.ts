import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { TextMatch, Match } from '../models/models';
import { PaypalResponse } from '../models/response';
import { AuthenticationService } from '../services/authentication.service';
import { PaypalService } from '../services/paypal.service';
import { TextService } from '../services/text.service';
import { OperationService } from '../services/operation.service';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit, OnDestroy{

  swipes!: number
  textMatches!: TextMatch[]
  myProfile!: Match | null
  paymentId!: string
  status!: string
  private subscription!: Subscription
  isLoading= true


  constructor(private operationService: OperationService, 
    private router: Router,
    private authenticationService: AuthenticationService,
    private textService: TextService,
    private paypalService: PaypalService,
    private title: Title,
    private activatedRoute: ActivatedRoute){

  }

  async ngOnInit(): Promise<void> {
      this.title.setTitle('FiiNDER - Homepage')
      const isProfileCompleted = await this.operationService.isProfileCompleted()
      if (!isProfileCompleted.profileCompleted){
        this.router.navigate(['/personaldetails'])
        return
      }
      const userStatus = await this.operationService.getSwipeStatus()
      this.swipes = userStatus.swipes

      this.myProfile = await this.operationService.getMyProfile()
      this.authenticationService.setProfile(this.myProfile)
      const response = await this.operationService.getMatches()
      this.textMatches = response
      this.activatedRoute.queryParams.subscribe(async params => {
        const paymentId = params['paymentId']
        const token = params['token']
        const payerId = params['PayerID']
        const response =  await this.paypalService.executePayment(paymentId, token, payerId)
        this.status = response.paymentStatus
        if (this.status === 'approved') {
          const userStatus = await this.paypalService.addSwipes();
          this.swipes = userStatus.swipes;
          this.paymentId = ''
          alert('+10 finds!')
          this.subscription.unsubscribe();
        }
      }
      )
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
  }

  startSwiping(){
    this.router.navigate(['/swipingpage'])
  }

  editProfile(){
    this.router.navigate(['/editprofile'])
  }

  goTextWindow(index: number){
    this.textService.setTargetUserToText(this.textMatches[index])
    this.router.navigate(['/textwindow'])
  }

  logout(){
    const confirmation = confirm('Do you want to log out?')
    if (confirmation){
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      localStorage.removeItem('token')
      this.router.navigate(['/login'])
    }    
  }

  changePassword(){

    this.router.navigate(['/changepassword'])
  }

  async buySwipes(){
    const response: PaypalResponse = await this.paypalService.buySwipes()
    this.paymentId = response.paymentId
    const confirmation = confirm('You will be directed to the payment site, do you want to proceed?')
    if (confirmation){
      window.location.href = response.link
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
