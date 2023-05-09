import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterRequest } from '../models/request';

@Component({
  selector: 'app-emailverification',
  templateUrl: './emailverification.component.html',
  styleUrls: ['./emailverification.component.css']
})
export class EmailverificationComponent implements OnInit {
  code!: string;
  form!: FormGroup;

  constructor(private authenticationService: AuthenticationService, private fb: FormBuilder,
    private router: Router) { 

    }

  ngOnInit(): void {
    this.code = this.authenticationService.getCode()
    this.form = this.createForm()
  }

  createForm(){
    return this.fb.group({
      codeToVerify: this.fb.control('', [Validators.required, Validators.minLength(6)])
    })
  }

  async verify(){
    const codeToVerify = this.form.value['codeToVerify']
    console.log(codeToVerify)
    if (codeToVerify != this.code){
      alert('Incorrect code entered')
      this.form.reset()
    } else {
      const request: RegisterRequest = {
        email: this.authenticationService.getEmail(),
        password: this.authenticationService.getPassword()
      }
      const response = await this.authenticationService.registerUser(request)
      localStorage.setItem('token', response.token)
      this.authenticationService.setUserID(response.userID)
      console.log(this.authenticationService.getUserID())
      this.router.navigate(['/personaldetails'])
    }
  }

  isFormInvalid(){
    return this.form.invalid
  }
}

