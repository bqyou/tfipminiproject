import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { EmailverificationComponent } from './components/emailverification.component';
import { NewuserpersonalinfoComponent } from './components/newuserpersonalinfo.component';
import { HomepageComponent } from './components/homepage.component';
import { SwipingpageComponent } from './components/swipingpage.component';
import { EditprofileComponent } from './components/editprofile.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'emailverification', component: EmailverificationComponent},
  {path: 'personaldetails', component: NewuserpersonalinfoComponent},
  {path: 'homepage', component: HomepageComponent},
  {path: 'swipingpage', component: SwipingpageComponent},
  {path: 'editprofile', component: EditprofileComponent},
  {path:'**', redirectTo:'homepage', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
