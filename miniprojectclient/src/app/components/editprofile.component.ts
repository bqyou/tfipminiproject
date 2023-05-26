import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Match } from '../models/models';
import { AuthenticationService } from '../services/authentication.service';
import { OperationService } from '../services/operation.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.css']
})
export class EditprofileComponent implements OnInit{

  imageUrl!: string
  displayName!: string
  dateOfBirth!: string
  gender!: string
  preference!: string
  selectedFile!: File
  aboutMe!: string

  profile!: Match
  form!: FormGroup
  isLoading=true

  constructor(private router: Router, private authenticationService: AuthenticationService,
    private fb: FormBuilder, private operationService: OperationService, private title: Title){

  }

  ngOnInit(): void {
      this.title.setTitle('FiiNDER - Edit Profile')
      this.profile = this.authenticationService.getProfile()
      this.imageUrl = this.profile.profilePic
      this.displayName = this.profile.displayName
      this.dateOfBirth = this.profile.dateOfBirth
      this.gender = this.profile.gender
      this.preference = this.profile.preference
      this.aboutMe = this.profile.aboutMe
      this.form = this.createForm()
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
  }

  goHome(){
    this.router.navigate(['/homepage'])
  }

  onFileSelected(event: any){
    const file: File = event.target.files[0]
    this.selectedFile = file
    const reader = new FileReader();
  reader.onload = () => {
    this.imageUrl = reader.result as string;
  };
  reader.readAsDataURL(file);
  }

  createForm(){
    return this.fb.group({
      displayName: this.fb.control(this.displayName, [Validators.required, Validators.minLength(2), Validators.maxLength(25)]),
      preference: this.fb.control(this.preference, Validators.required),
      file: this.fb.control(''),
      aboutMe: this.fb.control(this.aboutMe, [Validators.required, Validators.min(1), Validators.max(99)])
    })
  }

  async submitInfo(){
    const match : Match = {
      id: this.authenticationService.getProfile().id,
      displayName: this.form.value['displayName'],
      dateOfBirth: this.dateOfBirth,
      gender: this.gender,
      preference: this.form.value['preference'],
      profilePic: this.imageUrl,
      aboutMe: this.form.value['aboutMe'],
      age: 0
    }
    const response = await this.operationService.updateProfile(match)
    if (response.rowsUpdated == 1){
      alert('Profile updated!')
    }
    if (response.rowsUpdated == 0){
      alert('Updating profile failed. Please contact admin')
    }
    this.router.navigate(['/homepage'])
  }

  logout(){
    const confirmation = confirm('Do you want to log out?')
    if (confirmation){
      localStorage.removeItem('token')
      this.router.navigate(['/login'])
    }    
  }

}
