import { Component, OnInit } from '@angular/core';
import { Team } from '@src/app/models/team';
import { TeamRestService } from '@src/app/services/team-rest/team-rest.service';
import { LoadingCircleService } from '@services/loading-circle/loading-circle.service';

@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.css'],
})
export class FrontPageComponent implements OnInit {
  firstTeam!: Team;
  teams!: Team[];
  noTeams: boolean = true;
  loading = this.loader.loading$;

  constructor(
    private teamService: TeamRestService,
    private loader: LoadingCircleService
  ) {}

  ngOnInit(): void {
    this.loader.show();

    this.teamService.getTeams().subscribe((data) => {
      this.teams = data;
      this.firstTeam = this.teams.splice(0, 1)[0];
      this.loader.hide();
      if (this.firstTeam != null) {
        this.noTeams = false;
       
      }
    });
  }

  getWinrate(team: Team): Number {
    team.wins = 10;
    team.gamesPlayed = 19;

    return Math.round((team.wins / team.gamesPlayed) * 10 * 100) / 10;
  }
}
