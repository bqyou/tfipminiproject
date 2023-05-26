import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { OperationService } from '../services/operation.service';
import { LoginRequest, RegisterRequest } from '../models/request';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  signUpPressed = true
  loginForm !: FormGroup
  signupForm !: FormGroup
  showPassword: boolean = false
  showConfirmPassword: boolean = false
  showLoginPassword: boolean = false

  statusSwap(){
    this.signUpPressed = !this.signUpPressed
    this.loginForm.reset()
    this.signupForm.reset()
    this.showLoginPassword = false
    this.showPassword = false
    this.showConfirmPassword = false
  }

  toggleLoginPassword(){
    this.showLoginPassword = !this.showLoginPassword
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  constructor(private fb: FormBuilder, private router: Router, 
    private authenticationService: AuthenticationService, private operationService: OperationService){
  }

  ngOnInit(): void {
    this.loginForm = this.createLoginForm()
    this.signupForm = this.createSignupForm()      
  }

  createLoginForm(){
    return this.fb.group({
      loginEmail: this.fb.control('', [Validators.required, Validators.email]),
      loginPassword: this.fb.control('', [Validators.required])
    })
  }

  createSignupForm() {
    return this.fb.group({
      signupEmail: this.fb.control('', [Validators.required, Validators.email]),
      signupPassword: this.fb.control('', [Validators.required, Validators.minLength(8)]),
      signupConfirmPassword: this.fb.control('', [Validators.required])
    }, {
      validator: this.matchingPasswords('signupPassword', 'signupConfirmPassword')
    });
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup) => {
      const password = group.controls[passwordKey];
      const confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return confirmPassword.setErrors({ mismatch: true });
      } else {
        return confirmPassword.setErrors(null);
      }
    };
  }

  async login(){
    const request: LoginRequest = {
      email: this.loginForm.value['loginEmail'],
      password: this.loginForm.value['loginPassword']
    }
    const response = await this.authenticationService.login(request)
    if (response.token == "null"){
      alert("Email not found")
      return
    } else if (response.token == "wrongpassword"){
      alert("Wrong password")
      return
    } else {
      localStorage.setItem('token', response.token)
      this.authenticationService.setUserID(response.userID)
      console.log(this.authenticationService.getUserID())
      const isProfileCompleted = await this.operationService.isProfileCompleted()
      this.router.navigate(['/homepage'])
            
    }    
  }

  async signup(){    
    const request: RegisterRequest = {
      email: this.signupForm.value['signupEmail'],
      password: this.signupForm.value['signupPassword']
    }    
    const code = await this.authenticationService.getVerificationCode(request)
    if (code.code == null){ 
      alert('Email has been used, please use another email')
      this.signupForm.reset()
    }
    else {
      this.authenticationService.setCode(code['code'])
      this.authenticationService.setEmail(this.signupForm.value['signupEmail'])
      this.authenticationService.setPassword(this.signupForm.value['signupPassword'])     
      this.router.navigate(['/emailverification'])
    } 
  }

  isLoginFormInvalid(){
    return this.loginForm.invalid
  }

  isSignupFormInvalid(){
    return this.signupForm.invalid
  }

  async forgetPassword(){
    const request: LoginRequest = {
      email: this.loginForm.value['loginEmail'],
      password: ''
    }
    const confirmation = confirm('Do you want to reset your password? The new password will be sent to ' + request.email)
    if (confirmation){
      const response = await this.authenticationService.resetPassword(request)
    if (response==1){
      alert('New password sent to ' + request.email)
    } else {
      alert('Email not found')
    }
    this.loginForm.reset()
    }    
  }

}
