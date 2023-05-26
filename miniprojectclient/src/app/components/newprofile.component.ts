import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Profile } from '../models/models';
import { OperationService } from '../services/operation.service';

@Component({
  selector: 'app-newprofile',
  templateUrl: './newprofile.component.html',
  styleUrls: ['./newprofile.component.css']
})
export class NewprofileComponent implements OnInit {

  maxDate: Date = new Date(); // Today's date
  minDate: Date = new Date(this.maxDate.getFullYear() - 18, this.maxDate.getMonth(), this.maxDate.getDate() + 1);

  form!: FormGroup

  imageUrl: string | undefined;

  selectedFile!: File

  constructor(private fb: FormBuilder, private operationService: OperationService,
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
      aboutMe: this.fb.control('', [Validators.required, Validators.min(1), Validators.max(99)]),
      file: this.fb.control('', [Validators.required])
    })
  }

  async submitInfo(){
    const profile: Profile = {
      displayName: this.form.value['displayName'],
      dateOfBirth: this.form.value['dateOfBirth'],
      gender: this.form.value['gender'],
      preference: this.form.value['preference'],
      profilePic: this.selectedFile,
      aboutMe: this.form.value['aboutMe']
    }
    const response = await this.operationService.completeProfile(profile)
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
