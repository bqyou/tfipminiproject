import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Match } from '../models/models';
import { OperationService } from '../services/operation.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-findingpage',
  templateUrl: './findingpage.component.html',
  styleUrls: ['./findingpage.component.css']
})
export class FindingpageComponent {

  swipes!: number

  noMatch: boolean = false

  today: Date = new Date()

  match!: Match 

  x:number = 0

  constructor(private router: Router, private operationService: OperationService,
    private title: Title){

  }

  matches!: Match[]

  isLoading= true

  async ngOnInit(): Promise<void> {
    this.title.setTitle('FiiNDER - Finding')
    const userStatus = await this.operationService.getSwipeStatus()
    this.swipes = userStatus.swipes
    this.matches = await this.operationService.getProfiles(this.swipes)    
    if (this.matches.length == 0){
      this.noMatch = true
    }
    this.match = this.matches[0]
    if (this.match){
    this.match.age = this.calculateAge(this.match.dateOfBirth)
    }
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);

  }

  goHome(){
    this.router.navigate(['/homepage'])
  }

  pass(){
    this.swipes--
    this.operationService.swipe(this.match.id, "no")
    this.x ++
    if (this.x < this.matches.length){
      this.match = this.matches[this.x]
      this.match.age = this.calculateAge(this.match.dateOfBirth)
    } else {
      this.noMatch = true
    }    
    if (this.swipes == 0){
      alert('You have ran out of finds today! Come back tomorrow for more.')
    }
  }

  yes(){
    this.swipes--
    this.operationService.swipe(this.match.id, "yes")
    this.x ++
    if (this.x < this.matches.length){
      this.match = this.matches[this.x]
      this.match.age = this.calculateAge(this.match.dateOfBirth)
    } else {
      this.noMatch = true
    }    
    if (this.swipes == 0){
      alert('You have ran out of finds today! Come back tomorrow for more.')
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

  logout(){
    const confirmation = confirm('Do you want to log out?')
    if (confirmation){
      localStorage.removeItem('token')
      this.router.navigate(['/login'])
    }    
  }

}
