import { AsyncPipe, SlicePipe } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '@components/nav-bar/nav-bar.component';
import type { Team } from '@models/team';
import type { Tournament } from '@models/tournament';
import { LoadingCircleService } from '@services/loading-circle/loading-circle.service';
import { TeamRestService } from '@services/team-rest/team-rest.service';
import { TourneyRestService } from '@services/tourney-rest/tourney-rest.service';
import type { Observable } from 'rxjs';

@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.css'],
  imports: [NavBarComponent, RouterLink, MatProgressSpinnerModule, AsyncPipe, SlicePipe],
})
export class FrontPageComponent implements OnInit {
  private teamService = inject(TeamRestService);
  private tourneyService = inject(TourneyRestService);

  firstTeam!: Team;
  teams!: Team[];
  firstTourney!: Tournament;
  tourneys!: Tournament[];
  noInfo: boolean = true;
  loader: LoadingCircleService = new LoadingCircleService();
  loading: Observable<boolean> = this.loader.loading$;

  ngOnInit(): void {
    this.loader.show();

    this.teamService.getTeams().subscribe({
      next: (data) => {
        this.teams = data;
        this.firstTeam = this.teams.splice(0, 1)[0];
      },
      error: () => console.log('Error fetching teams'),
    });

    this.tourneyService.getTourneys().subscribe((data) => {
      this.tourneys = data;
      this.firstTourney = this.tourneys.splice(0, 1)[0];

      if (this.firstTeam !== undefined || this.firstTourney !== undefined) {
        this.noInfo = false;
      }
    });
  }

  getWinrate(team: Team): number {
    team.wins = 10;
    team.gamesPlayed = 19;

    return Math.round((team.wins / team.gamesPlayed) * 100);
  }
}
