import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../service/authentication.service';
import { Router } from '@angular/router';
import { ChangePasswordRequest } from '../models/request';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit{
  changePasswordForm!: FormGroup;
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private formBuilder: FormBuilder, 
    private authenticationService: AuthenticationService,
    private router: Router) { }

  ngOnInit() {
    this.changePasswordForm = this.createForm()
  }

  createForm(){
    return this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    },{
      validator: this.matchingPasswords('newPassword', 'confirmPassword')
    });
  }

  toggleOldPasswordVisibility() {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  isChangePasswordFormInvalid() {
    return this.changePasswordForm.invalid;
  }

  async changePassword() {
    if (this.changePasswordForm.value['oldPassword'].length==0 || this.changePasswordForm.value['newPassword'].length==0 || this.changePasswordForm.value['confirmPassword'].length==0){
      alert('Please fill in all fields')
    }
    if (this.changePasswordForm.value['newPassword']!=this.changePasswordForm.value['confirmPassword']){
      alert('Please make sure new password and confirm password are the same')
    }
    if (this.changePasswordForm.valid){
      const request: ChangePasswordRequest = {
        oldPassword: this.changePasswordForm.value['oldPassword'],
        newPassword: this.changePasswordForm.value['newPassword']
      }
      const result = await this.authenticationService.changePassword(request)
      if (result==1){
        alert('Password successfully changed!')
        this.router.navigate(['/homepage'])
      } else {
        alert('Wrong password entered')
      }
    }    
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

  goHome(){
    this.router.navigate(['/homepage'])
  }
}
