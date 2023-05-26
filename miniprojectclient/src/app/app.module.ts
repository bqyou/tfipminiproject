import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyInterceptorService } from './services/my-interceptor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './models/material';
import { LoginComponent } from './components/login.component';
import { EmailverificationComponent } from './components/emailverification.component';
import { NewprofileComponent } from './components/newprofile.component';
import { HomepageComponent } from './components/homepage.component';
import { EditprofileComponent } from './components/editprofile.component';
import { ChangepasswordComponent } from './components/changepassword.component';
import { FindingpageComponent } from './components/findingpage.component';
import { TextComponent } from './components/text.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EmailverificationComponent,
    NewprofileComponent,
    HomepageComponent,
    EditprofileComponent,
    ChangepasswordComponent,
    FindingpageComponent,
    TextComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    BrowserAnimationsModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: MyInterceptorService, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
