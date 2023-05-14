import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { EmailverificationComponent } from './components/emailverification.component';
import { NewuserpersonalinfoComponent } from './components/newuserpersonalinfo.component';
import { HomepageComponent } from './components/homepage.component';
import { SwipingpageComponent } from './components/swipingpage.component';
import { EditprofileComponent } from './components/editprofile.component';
import { TextComponent } from './components/text.component';
import { TestComponent } from './components/test.component';
import { ChangepasswordComponent } from './components/changepassword.component';
import { AuthGuardService } from './service/auth-guard.service';

const routes: Routes = [
  {path: '', component: HomepageComponent, canActivate:[AuthGuardService]},
  {path: 'emailverification', component: EmailverificationComponent},
  {path: 'changepassword', component: ChangepasswordComponent},
  {path: 'personaldetails', component: NewuserpersonalinfoComponent},
  {path: 'homepage', component: HomepageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'swipingpage', component: SwipingpageComponent},
  {path: 'editprofile', component: EditprofileComponent},
  {path: 'textwindow', component: TextComponent},
  {path:'**', redirectTo:'homepage', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

// 