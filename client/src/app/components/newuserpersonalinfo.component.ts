import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../service/authentication.service';
import { Profile } from '../models/models';
import { Router } from '@angular/router';
import { OperationsService } from '../service/operations.service';

@Component({
  selector: 'app-newuserpersonalinfo',
  templateUrl: './newuserpersonalinfo.component.html',
  styleUrls: ['./newuserpersonalinfo.component.css']
})
export class NewuserpersonalinfoComponent implements OnInit{

  maxDate: Date = new Date(); // Today's date
  minDate: Date = new Date(this.maxDate.getFullYear() - 18, this.maxDate.getMonth(), this.maxDate.getDate() + 1);

  form!: FormGroup

  imageUrl: string | undefined;

  selectedFile!: File

  constructor(private fb: FormBuilder, private operationsService: OperationsService,
              private router: Router){}

  onFileSelected(event: any){
    const file: File = event.target.files[0]
    this.selectedFile = file
    const reader = new FileReader();
  reader.onload = () => {
    this.imageUrl = reader.result as string;
  };
  reader.readAsDataURL(file);
  }

  ngOnInit(): void {
    this.form = this.createForm()
    this.form.get('dateOfBirth')?.setValue(this.minDate.toISOString().slice(0,10));
      
  }

  createForm(){
    return this.fb.group({
      displayName: this.fb.control('', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]),
      dateOfBirth: this.fb.control(new Date(), [Validators.required]),
      gender: this.fb.control('', Validators.required),
      preference: this.fb.control('', Validators.required),
      file: this.fb.control('', [Validators.required])
    })
  }

  async submitInfo(){
    const profile: Profile = {
      displayName: this.form.value['displayName'],
      dateOfBirth: this.form.value['dateOfBirth'],
      gender: this.form.value['gender'],
      preference: this.form.value['preference'],
      profilePic: this.selectedFile
    }
    console.log(profile)
    const response = await this.operationsService.completeProfile(profile)
    if (response.rowsUpdated == 0){
      alert('Error in completing profile, please try again')
      this.router.navigate([''])
    } else {
      this.router.navigate(['/homepage'])
    }

  }

  onKeyDown(event: { preventDefault: () => void; }) {
    event.preventDefault();
  }

}
