import { UserRestService } from '@services/user-rest/user-rest.service';
import { Component, OnInit } from '@angular/core';
import { Team } from '@models/team';
import { TeamRestService } from '@services/team-rest/team-rest.service';
import { Observable } from 'rxjs';
import { getRankIcon } from '@src/app/shared/utils';
import { environment } from '@src/environments/environment';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor } from '@angular/common';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
    selector: 'app-view-all-teams',
    templateUrl: './view-all-teams.component.html',
    styleUrls: ['./view-all-teams.component.css'],
    standalone: true,
    imports: [NavBarComponent, NgIf, MatButtonModule, RouterLink, NgFor]
})
export class ViewAllTeamsComponent implements OnInit {
  team!: Team;
  nickname!: string;
  //searchText!: string;
  teams: any = [];

  constructor(private userService: UserRestService, private teamService: TeamRestService) { }

  ngOnInit(): void {
    this.userService.getUser().subscribe((user) => {
      this.nickname = user.teamTag!;
      this.getTeams().subscribe((data: {}) => {
        this.teams = data;

        this.getTeam(this.nickname).subscribe(team => {
          this.team = team;
          this.teams = this.removeItemOnce(this.team);
        });
      });
    });
  }

  getTeam(tag: string): Observable<Team> {
    return this.teamService.getTeam(tag);
  }

  getClass() {
    return (this.team?.poster == undefined) ? "none" : "caption";
  }

  public createImgPath = (serverPath: string) => {
    return (serverPath != undefined) ? `${environment.apiUrl}/Resources/Images/${serverPath}` : "assets/images/image_placeholder.png";
  }

  removeItemOnce(team: Team) {
    const index = this.teams.indexOf(team);
    if (index > -1) {
      this.teams.splice(index, 1);
    }
    return this.teams;
  }

  getTeams(): Observable<Team[]> {
    return this.teamService.getTeams();
  }

  getTeamSize() {
    return this.teams.length;
  }

  getRank(key: any) {
    return getRankIcon(key);
  }

}
