import { Routes } from '@angular/router';

import { ViewMyTeamComponent } from '@components/view-my-team/view-my-team.component';
import { JoinTournamentComponent } from '@components/join-tournament/join-tournament.component';
import { ViewTourneyComponent } from '@components/view-tourney/view-tourney.component';
import { ViewAllTourneysComponent } from '@components/view-all-tourneys/view-all-tourneys.component';
import { ViewTeamComponent } from '@components/view-team/view-team.component';
import { ViewAllTeamsComponent } from '@components/view-all-teams/view-all-teams.component';
import { CreateTeamComponent } from '@components/create-team/create-team.component';
import { FrontPageComponent } from '@components/front-page/front-page.component';
import { LoginComponent } from '@components/login/login.component';
import { RegisterComponent } from '@components/register/register.component';
import { ViewProfileComponent } from '@components/view-profile/view-profile.component';
import { CreateTourneyComponent } from '@components/create-tourney/create-tourney.component';
import { RequestsComponent } from '@components/requests/requests.component';
import { ManageTourneyComponent } from '@components/manage-tourney/manage-tourney.component';
import { ViewAllMyTourneysComponent } from '@components/view-all-my-tourneys/view-all-my-tourneys.component';
import { AboutComponent } from '@components/about/about.component';
import { EditTournamentComponent } from '@components/edit-tournament/edit-tournament.component';

import { loggedInAuthGuard } from './guard/loggedinauthguard.guard';
import { authGuard } from './guard/auth-guard.guard'

export const routes: Routes = [
  {
    path: '',
    component: FrontPageComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loggedInAuthGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [loggedInAuthGuard],
  },
  {
    path: 'profile',
    component: ViewProfileComponent,
    canActivate: [authGuard],
  },
  {
    path: 'create-team',
    component: CreateTeamComponent,
    canActivate: [authGuard],
  },
  {
    path: 'create-tourney',
    component: CreateTourneyComponent,
    canActivate: [authGuard],
  },
  {
    path: 'view-my-team',
    component: ViewMyTeamComponent,
    canActivate: [authGuard],
    canActivateChild: [loggedInAuthGuard],
  },
  {
    path: 'view-team/:id',
    component: ViewTeamComponent,
    canActivate: [authGuard],
    canActivateChild: [loggedInAuthGuard],
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
    canActivate: [authGuard],
  },
  { path: 'manage-tourney', component: ManageTourneyComponent },
  { path: 'view-my-tourneys', component: ViewAllMyTourneysComponent },
  { path: 'update-tourney/:id', component: EditTournamentComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
