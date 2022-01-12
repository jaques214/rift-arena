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
import {MatTableModule} from '@angular/material/table';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { AppComponent } from './app.component';
import { NavBarComponent } from '@components/nav-bar/nav-bar.component';
import { LoginComponent } from '@components/login/login.component';
import { FrontPageComponent } from '@components/front-page/front-page.component';
import { RegisterComponent } from '@components/register/register.component';
import { SharedFormFieldComponent } from '@components/shared-form-field/shared-form-field.component';
import { ViewProfileComponent } from '@components/view-profile/view-profile.component';
import { CreateTeamComponent } from '@components/create-team/create-team.component';
import { CreateTourneyComponent } from '@components/create-tourney/create-tourney.component';
import { RequestsComponent } from '@components/requests/requests.component';
import { ViewTeamComponent } from '@components/view-team/view-team.component';
import { ViewAllTeamsComponent } from '@components/view-all-teams/view-all-teams.component';

import { JwtInterceptor } from './interceptors/jwt/jwt-interceptor.interceptor';
import { LoadingCircleService } from '@services/loading-circle/loading-circle.service';
import { AuthService } from '@services/auth/auth.service';
import { UserRestService } from '@services/user-rest/user-rest.service';
import { TeamRestService } from '@services/team-rest/team-rest.service';
import { AuthGuard } from './guard/auth-guard.guard';
import { LoggedInAuthGuard } from './guard/loggedinauthguard.guard';
import { UploadComponent } from './components/upload/upload.component';
import { SharedFormGroupComponent } from './components/shared-form-group/shared-form-group.component';
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
    CreateTourneyComponent,
    RequestsComponent,
    ViewTeamComponent,
    ViewAllTeamsComponent,
    UploadComponent,
    SharedFormGroupComponent,
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
    MatTableModule,
    MatRadioModule,
    MatExpansionModule,
    MatCheckboxModule,
    Ng2SearchPipeModule,
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
