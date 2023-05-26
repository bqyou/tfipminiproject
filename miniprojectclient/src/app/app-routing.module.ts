import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { HomepageComponent } from './components/homepage.component';
import { EmailverificationComponent } from './components/emailverification.component';
import { ChangepasswordComponent } from './components/changepassword.component';
import { NewprofileComponent } from './components/newprofile.component';
import { LoginComponent } from './components/login.component';
import { FindingpageComponent } from './components/findingpage.component';
import { EditprofileComponent } from './components/editprofile.component';
import { TextComponent } from './components/text.component';

const routes: Routes = [
  {path: '', component: HomepageComponent, canActivate:[AuthGuardService]},
  {path: 'emailverification', component: EmailverificationComponent},
  {path: 'changepassword', component: ChangepasswordComponent},
  {path: 'personaldetails', component: NewprofileComponent},
  {path: 'homepage', component: HomepageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'swipingpage', component: FindingpageComponent},
  {path: 'editprofile', component: EditprofileComponent},
  {path: 'textwindow', component: TextComponent},
  {path:'**', redirectTo:'', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

//
