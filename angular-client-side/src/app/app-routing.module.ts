import { JoinTournamentComponent } from './components/join-tournament/join-tournament.component';
import { ViewTourneyComponent } from './components/view-tourney/view-tourney.component';
import { ViewAllTourneysComponent } from './components/view-all-tourneys/view-all-tourneys.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewTeamComponent } from '@components/view-team/view-team.component';
import { ViewAllTeamsComponent } from '@components/view-all-teams/view-all-teams.component';
import { CreateTeamComponent } from '@components/create-team/create-team.component';
import { FrontPageComponent } from '@components/front-page/front-page.component';
import { LoginComponent } from '@components/login/login.component';
import { RegisterComponent } from '@components/register/register.component';
import { ViewProfileComponent } from '@components/view-profile/view-profile.component';
import { CreateTourneyComponent } from './components/create-tourney/create-tourney.component';
import { RequestsComponent } from '@components/requests/requests.component';
import { LoggedInAuthGuard } from './guard/loggedinauthguard.guard';
import { AuthGuard } from './guard/auth-guard.guard';
import { ManageTourneyComponent } from './components/manage-tourney/manage-tourney.component';
import { ViewAllMyTourneysComponent } from './components/view-all-my-tourneys/view-all-my-tourneys.component';
import { AboutComponent } from './components/about/about.component';

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
    path: 'view-team',
    component: ViewTeamComponent,
    canActivate: [AuthGuard],
    canActivateChild: [LoggedInAuthGuard],
  },
  {
    path: 'view-all-teams',
    component: ViewAllTeamsComponent,
  },
  {
    path: 'view-all-tourneys',
    component: ViewAllTourneysComponent,
  },
  {
    path: 'view-tourney/:id',
    component: ViewTourneyComponent,
  },
  {
    path: 'join-tournament',
    component: JoinTournamentComponent,
  },
  {
    path: 'requests',
    component: RequestsComponent,
    canActivate: [AuthGuard],
  },
  { path: 'manage-tourney', component: ManageTourneyComponent },
  { path: 'view-my-tourneys', component: ViewAllMyTourneysComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
