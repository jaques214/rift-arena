import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavBarComponent } from '@components/nav-bar/nav-bar.component';
import { LoginComponent } from '@components/login/login.component';
import { FrontPageComponent } from '@components/front-page/front-page.component';
import { RegisterComponent } from '@components/register/register.component';
import { SharedFormFieldComponent } from '@components/shared-form-field/shared-form-field.component';
import { ViewProfileComponent } from '@components/view-profile/view-profile.component';
import { LoadingCircleService } from '@services/loading-circle/loading-circle.service';
import { CreateTeamComponent } from '@components/create-team/create-team.component';
import { JwtInterceptor } from './interceptors/jwt/jwt-interceptor.interceptor';

import { AuthService } from '@services/auth/auth.service';
import { UserRestService } from '@services/user-rest/user-rest.service';
import { TeamRestService } from '@services/team-rest/team-rest.service';
import { AuthGuard } from './guard/auth-guard.guard';
import { LoggedInAuthGuard } from './guard/loggedinauthguard.guard';
@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    LoginComponent,
    FrontPageComponent,
    RegisterComponent,
    SharedFormFieldComponent,
    ViewProfileComponent,
    CreateTeamComponent,
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
    HttpClientModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
  ],
  providers: [
    AuthService,
    UserRestService,
    TeamRestService,
    LoadingCircleService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    AuthGuard,
    LoggedInAuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
