import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService} from '../service/authentication.service';
import { RegisterRequest, LoginRequest, ChangePasswordRequest } from '../models/request';
import { OperationsService } from '../service/operations.service';
import { Match, Profile, TextMatch } from '../models/models';
import { TextService } from '../service/text.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit{

  swipes!: number

  noMatch: boolean = false

  today: Date = new Date()

  match: Match ={
    id: 5,
    displayName: 'Daenyrys',
    dateOfBirth: '1994-03-11',
    gender: 'female',
    preference: 'male',
    profilePic: `C:\\Users\\Admin\\Pictures\\testdata\\rei.png`,
    age: 22 
  }

  x:number = 0

  constructor(private router: Router, private operationsService: OperationsService){

  }

  matches!: Match[]

  async ngOnInit(): Promise<void> {
    

  }

  goHome(){
  }

  pass(){
    
  }

  yes(){
    
  }
}
