import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule, } from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button'; 
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth/auth.service';
import { UserRestService } from './services/user-rest/user-rest.service';
import { TeamRestService } from './services/team-rest/team-rest.service';
import { FrontPageComponent } from './components/front-page/front-page.component';
import { RegisterComponent } from './components/register/register.component';
import { SharedFormFieldComponent } from './components/shared-form-field/shared-form-field.component';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    LoginComponent,
    FrontPageComponent,
    RegisterComponent,
    SharedFormFieldComponent,
    ViewProfileComponent
  ],
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [AuthService, UserRestService, TeamRestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
