import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';

import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth/auth.service';
import { UserRestService } from './services/user-rest/user-rest.service';
import { TeamRestService } from './services/team-rest/team-rest.service';
import { FrontPageComponent } from './components/front-page/front-page.component';
import { RegisterComponent } from './components/register/register.component';
import { SharedFormFieldComponent } from './components/shared-form-field/shared-form-field.component';
import { LoadingCircleService } from './services/loading-circle/loading-circle.service';
import { CreateTeamComponent } from './components/create-team/create-team.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    LoginComponent,
    FrontPageComponent,
    RegisterComponent,
    SharedFormFieldComponent,
    CreateTeamComponent,
  ],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthService,
    UserRestService,
    TeamRestService,
    LoadingCircleService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
