import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { OperationsService } from '../service/operations.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { Match, TextMatch } from '../models/models';
import { TextService } from '../service/text.service';
import { PaypalService } from '../service/paypal.service';
import { PaypalResponse } from '../models/response';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit, OnDestroy {
  swipes!: number
  textMatches!: TextMatch[]
  myProfile!: Match | null
  paymentId!: string
  status!: string
  private subscription!: Subscription
  isLoading= true


  constructor(private operationsService: OperationsService, 
    private router: Router,
    private authenticationService: AuthenticationService,
    private textService: TextService,
    private paypalService: PaypalService,
    private changeDetectorRef: ChangeDetectorRef){

  }

  async ngOnInit(): Promise<void> {  
      const userStatus = await this.operationsService.getSwipeStatus()
      this.swipes = userStatus.swipes

      this.myProfile = await this.operationsService.getMyProfile()
      this.authenticationService.setProfile(this.myProfile)
      const response = await this.operationsService.getMatches()
      this.textMatches = response
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
    localStorage.removeItem('token')
    this.router.navigate(['/login'])
  }

  changePassword(){
    this.router.navigate(['/changepassword'])
  }

  async buySwipes(){
    const response: PaypalResponse = await this.paypalService.buySwipes()
    this.paymentId = response.paymentId
    const confirmation = confirm('You will be directed to the payment site, do you want to proceed?')
    if (confirmation){
      window.open(response.link, '_blank')
    }
    this.subscription = interval(5000).subscribe(async () => {
      const response = await this.paypalService.checkPaymentStatus(this.paymentId);
      this.status = response.paymentStatus
      console.log('Payment status - ' + this.status);
      if (this.status === 'approved') {
        const userStatus = await this.paypalService.addSwipes();
        this.swipes = userStatus.swipes;
        console.log(this.swipes + 'current')
        alert('+10 swipes!')
        this.subscription.unsubscribe();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
