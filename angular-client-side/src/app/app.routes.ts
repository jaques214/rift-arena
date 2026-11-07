import { Routes } from '@angular/router';

import { loggedInAuthGuard } from './guard/loggedinauthguard.guard';
import { authGuard } from './guard/auth-guard.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@components/front-page/front-page.component').then((m) => m.FrontPageComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('@components/login/login.component').then((m) => m.LoginComponent),
    canActivate: [loggedInAuthGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('@components/register/register.component').then((m) => m.RegisterComponent),
    canActivate: [loggedInAuthGuard],
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('@components/view-profile/view-profile.component').then((m) => m.ViewProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: 'create-team',
    loadComponent: () =>
      import('@components/create-team/create-team.component').then((m) => m.CreateTeamComponent),
    canActivate: [authGuard],
  },
  {
    path: 'create-tourney',
    loadComponent: () =>
      import('@components/create-tourney/create-tourney.component').then(
        (m) => m.CreateTourneyComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'view-my-team',
    loadComponent: () =>
      import('@components/view-my-team/view-my-team.component').then((m) => m.ViewMyTeamComponent),
    canActivate: [authGuard],
    canActivateChild: [loggedInAuthGuard],
  },
  {
    path: 'view-team/:id',
    loadComponent: () =>
      import('@components/view-team/view-team.component').then((m) => m.ViewTeamComponent),
    canActivate: [authGuard],
    canActivateChild: [loggedInAuthGuard],
  },
  {
    path: 'view-all-teams',
    loadComponent: () =>
      import('@components/view-all-teams/view-all-teams.component').then(
        (m) => m.ViewAllTeamsComponent,
      ),
  },
  {
    path: 'view-all-tourneys',
    loadComponent: () =>
      import('@components/view-all-tourneys/view-all-tourneys.component').then(
        (m) => m.ViewAllTourneysComponent,
      ),
  },
  {
    path: 'view-tourney/:id',
    loadComponent: () =>
      import('@components/view-tourney/view-tourney.component').then((m) => m.ViewTourneyComponent),
  },
  {
    path: 'join-tournament',
    loadComponent: () =>
      import('@components/join-tournament/join-tournament.component').then(
        (m) => m.JoinTournamentComponent,
      ),
  },
  {
    path: 'requests',
    loadComponent: () =>
      import('@components/requests/requests.component').then((m) => m.RequestsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'manage-tourney',
    loadComponent: () =>
      import('@components/manage-tourney/manage-tourney.component').then(
        (m) => m.ManageTourneyComponent,
      ),
  },
  {
    path: 'view-my-tourneys',
    loadComponent: () =>
      import('@components/view-all-my-tourneys/view-all-my-tourneys.component').then(
        (m) => m.ViewAllMyTourneysComponent,
      ),
  },
  {
    path: 'update-tourney/:id',
    loadComponent: () =>
      import('@components/edit-tournament/edit-tournament.component').then(
        (m) => m.EditTournamentComponent,
      ),
  },
  {
    path: 'about',
    loadComponent: () => import('@components/about/about.component').then((m) => m.AboutComponent),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
