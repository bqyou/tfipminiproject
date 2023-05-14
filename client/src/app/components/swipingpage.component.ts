import { Component, OnInit } from '@angular/core';
import { Match } from '../models/models';
import { Router } from '@angular/router';
import { OperationsService } from '../service/operations.service';

@Component({
  selector: 'app-swipingpage',
  templateUrl: './swipingpage.component.html',
  styleUrls: ['./swipingpage.component.css']
})
export class SwipingpageComponent implements OnInit {

  swipes!: number

  noMatch: boolean = false

  today: Date = new Date()

  match!: Match 

  x:number = 0

  constructor(private router: Router, private operationsService: OperationsService){

  }

  matches!: Match[]

  async ngOnInit(): Promise<void> {
    const userStatus = await this.operationsService.getSwipeStatus()
    this.swipes = userStatus.swipes
    this.matches = await this.operationsService.getProfiles(this.swipes)    
    if (this.matches.length == 0){
      this.noMatch = true
    }
    this.match = this.matches[0]
    if (this.match){
    this.match.age = this.calculateAge(this.match.dateOfBirth)
    }

  }

  goHome(){
    this.router.navigate(['/homepage'])
  }

  pass(){
    this.swipes--
    this.operationsService.swipe(this.match.id, "no")
    this.x ++
    if (this.x < this.matches.length){
      this.match = this.matches[this.x]
      this.match.age = this.calculateAge(this.match.dateOfBirth)
    } else {
      this.noMatch = true
    }    
    if (this.swipes == 0){
      alert('You have ran out of swipes today! Come back tomorrow for more.')
    }
  }

  yes(){
    this.swipes--
    this.operationsService.swipe(this.match.id, "yes")
    this.x ++
    if (this.x < this.matches.length){
      this.match = this.matches[this.x]
      this.match.age = this.calculateAge(this.match.dateOfBirth)
    } else {
      this.noMatch = true
    }    
    if (this.swipes == 0){
      alert('You have ran out of swipes today! Come back tomorrow for more.')
    }
  }

  calculateAge(dateOfBirth: string): number {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    if (today.getMonth() < birthDate.getMonth() || 
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

}
