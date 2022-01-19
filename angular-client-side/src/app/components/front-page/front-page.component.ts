import { Component, OnInit } from '@angular/core';
import { Team } from '@src/app/models/team';
import { TeamRestService } from '@src/app/services/team-rest/team-rest.service';
import { LoadingCircleService } from '@services/loading-circle/loading-circle.service';
import { Tournament } from '@src/app/models/tournament';
import { TourneyRestService } from '@src/app/services/tourney-rest/tourney-rest.service';

@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.css'],
})
export class FrontPageComponent implements OnInit {
  firstTeam!: Team;
  teams!: Team[];
  firstTourney!: Tournament;
  tourneys!: Tournament[];
  noInfo: boolean = true;
  loading = this.loader.loading$;

  constructor(
    private teamService: TeamRestService,
    private tourneyService: TourneyRestService,
    private loader: LoadingCircleService
  ) {}

  ngOnInit(): void {
    this.loader.show();

    this.teamService.getTeams().subscribe((data) => {
      this.teams = data;
      this.firstTeam = this.teams.splice(0, 1)[0];
    });

    this.tourneyService.getTourneys().subscribe((data) => {
      this.tourneys = data;
      this.firstTourney = this.tourneys.splice(0, 1)[0];
      
      if (this.firstTeam != undefined ||  this.firstTourney != undefined) {
        this.noInfo = false;
      }
    });

    
  }

  getWinrate(team: Team): Number {
    team.wins = 10;
    team.gamesPlayed = 19;

    return Math.round((team.wins / team.gamesPlayed) * 100);
  }
}
