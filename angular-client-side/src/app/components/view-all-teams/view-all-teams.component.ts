import { Component, OnInit } from '@angular/core';
import { Team } from '@models/team';
import { TeamRestService } from '@services/team-rest/team-rest.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-view-all-teams',
  templateUrl: './view-all-teams.component.html',
  styleUrls: ['./view-all-teams.component.css']
})
export class ViewAllTeamsComponent implements OnInit {
  team?: Team;
  teams: any = [];
  
  constructor(private teamService: TeamRestService) { }

  ngOnInit(): void {
    this.getTeam().subscribe((team) => {
      this.team = team;
      console.log(this.team);
    });

    this.getTeams().subscribe((data: {}) => {
      this.teams = data;
      console.log(this.teams)
    });
  }

  getTeam(): Observable<Team> {
    return this.teamService.getTeam(1);
  }

  getTeams(): Observable<Team[]> {
    return this.teamService.getTeams();
  }

  addTeamPoster() {
    
  }

}
