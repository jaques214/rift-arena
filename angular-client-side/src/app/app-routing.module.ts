import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateTeamComponent } from '@components/create-team/create-team.component';
import { FrontPageComponent } from '@components/front-page/front-page.component';
import { LoginComponent } from '@components/login/login.component';
import { RegisterComponent } from '@components/register/register.component';
import { ViewProfileComponent } from '@components/view-profile/view-profile.component';
import { CreateTourneyComponent } from './components/create-tourney/create-tourney.component';
import { RequestsComponent } from '@components/requests/requests.component';
import { LoggedInAuthGuard } from './guard/loggedinauthguard.guard';
import { AuthGuard } from './guard/auth-guard.guard';

const routes: Routes = [
  {
    path: '',
    component: FrontPageComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoggedInAuthGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [LoggedInAuthGuard],
  },
  {
    path: 'profile',
    component: ViewProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create-team',
    component: CreateTeamComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create-tourney',
    component: CreateTourneyComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'requests',
    component: RequestsComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
