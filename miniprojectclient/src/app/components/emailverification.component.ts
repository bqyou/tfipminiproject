import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterRequest } from '../models/request';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-emailverification',
  templateUrl: './emailverification.component.html',
  styleUrls: ['./emailverification.component.css']
})
export class EmailverificationComponent implements OnInit {

  code!: string;
  form!: FormGroup;
  isLoading = false

  constructor(private authenticationService: AuthenticationService, private fb: FormBuilder,
    private router: Router) { 

    }

  ngOnInit(): void {
    this.code = this.authenticationService.getCode()
    this.form = this.createForm()
  }

  focusNextInput(nextInput: number) {
    const inputSelector = `.verification-code-input input:nth-child(${nextInput})`;
    const nextInputElement = document.querySelector(inputSelector) as HTMLInputElement;
    nextInputElement.focus();
  }

  createForm(){
    return this.fb.group({
      // codeToVerify: this.fb.control('', [Validators.required]),
      digit1: this.fb.control('', [Validators.required]),
      digit2: this.fb.control('', [Validators.required]),
      digit3: this.fb.control('', [Validators.required]),
      digit4: this.fb.control('', [Validators.required]),
      digit5: this.fb.control('', [Validators.required]),
      digit6: this.fb.control('', [Validators.required])
    })
  }

  async verify(){
    this.isLoading = true
    const codeToVerify2 = this.form.value['digit1'] +
                          this.form.value['digit2'] +
                          this.form.value['digit3'] +
                          this.form.value['digit4'] +
                          this.form.value['digit5'] +
                          this.form.value['digit6'] 
    if (codeToVerify2 != this.code){
      alert('Incorrect code entered')
      this.isLoading = false
      this.form.reset()
    } else {
      const request: RegisterRequest = {
        email: this.authenticationService.getEmail(),
        password: this.authenticationService.getPassword()
      }
      const response = await this.authenticationService.registerUser(request)
      localStorage.setItem('token', response.token)
      this.authenticationService.setUserID(response.userID)
      this.router.navigate(['/personaldetails'])
    }
  }

  isFormInvalid(){
    return this.form.invalid
  }

}
