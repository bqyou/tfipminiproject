import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { Match } from '../models/models';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OperationsService } from '../service/operations.service';

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

  profile!: Match
  form!: FormGroup

  constructor(private router: Router, private authenticationService: AuthenticationService,
    private fb: FormBuilder, private operationsService: OperationsService){

  }

  ngOnInit(): void {
      this.profile = this.authenticationService.getProfile()
      this.imageUrl = this.profile.profilePic
      this.displayName = this.profile.displayName
      this.dateOfBirth = this.profile.dateOfBirth
      this.gender = this.profile.gender
      this.preference = this.profile.preference
      this.form = this.createForm()
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
      file: this.fb.control('')
    })
  }

  async submitInfo(){
    const match : Match = {
      id: this.authenticationService.getUserID(),
      displayName: this.form.value['displayName'],
      dateOfBirth: this.dateOfBirth,
      gender: this.gender,
      preference: this.form.value['preference'],
      profilePic: this.imageUrl,
      age: 0
    }
    const response = await this.operationsService.updateProfile(match)
    if (response.rowsUpdated == 1){
      alert('Profile updated!')
    }
    if (response.rowsUpdated == 0){
      alert('Updating profile failed. Please contact admin')
    }
    this.router.navigate(['/homepage'])
  }

}
