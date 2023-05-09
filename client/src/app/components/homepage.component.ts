import { Component, OnInit } from '@angular/core';
import { OperationsService } from '../service/operations.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { TextMatch } from '../models/models';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  swipes!: number
  isPremium!: boolean
  textMatches!: TextMatch[]

  constructor(private operationsService: OperationsService, 
    private route: Router,
    private authenticationService: AuthenticationService){

  }

  async ngOnInit(): Promise<void> {
      const userStatus = await this.operationsService.getSwipeStatus()
      const myProfile = await this.operationsService.getMyProfile(this.authenticationService.getUserID())
      this.authenticationService.setProfile(myProfile)
      console.log(myProfile)
      this.swipes = userStatus.swipes
      this.isPremium = userStatus.isPremium
      const response = await this.operationsService.getMatches()
      this.textMatches = response
  }

  startSwiping(){
    this.route.navigate(['/swipingpage'])
  }

  editProfile(){
    this.route.navigate(['/editprofile'])
  }
}
