import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login.component';
import { EmailverificationComponent } from './components/emailverification.component';
import { NewuserpersonalinfoComponent } from './components/newuserpersonalinfo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HomepageComponent } from './components/homepage.component';
import { MyInterceptor } from './service/HttpInterceptors';
import { SwipingpageComponent } from './components/swipingpage.component';
import { EditprofileComponent } from './components/editprofile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './models/materials';
import { TextComponent } from './components/text.component';
import { TestComponent } from './components/test.component';
import { ChangepasswordComponent } from './components/changepassword.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EmailverificationComponent,
    NewuserpersonalinfoComponent,
    HomepageComponent,
    SwipingpageComponent,
    EditprofileComponent,
    TextComponent,
    TestComponent,
    ChangepasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
