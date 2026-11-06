import { NgOptimizedImage } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import type { Team } from '@models/team';
import { TeamRestService } from '@services/team-rest/team-rest.service';
import { UserRestService } from '@services/user-rest/user-rest.service';
import { getRankIcon } from '@src/app/shared/utils';
import { environment } from '@src/environments/environment';
import type { Observable } from 'rxjs';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
    selector: 'app-view-all-teams',
    templateUrl: './view-all-teams.component.html',
    styleUrls: ['./view-all-teams.component.css'],
    imports: [NavBarComponent, MatButtonModule, RouterLink, NgOptimizedImage]
})
export class ViewAllTeamsComponent implements OnInit {
  private userService = inject(UserRestService);
  private teamService = inject(TeamRestService);

  team!: Team;
  //searchText!: string;
  teams: Team[] = [];

  ngOnInit(): void {
    this.userService.getUser().subscribe((user) => {
      const nickname = user.teamTag;
      console.log("User's team tag: ", nickname);
      if (nickname === null) return; // user is not in a team, so we don't need to do anything

      this.getTeams().subscribe((data: Team[]) => {
        this.teams = data;

        this.getTeam(nickname).subscribe(team => {
          this.team = team;
          this.teams = this.removeItemOnce(this.team);
        });
      });
    });
  }

  recursiveDivideBy2(n: number): number {
    if (n === 1) return 1;
    return this.recursiveDivideBy2(n / 2);
  }

  calculateStages(): number {
    //return this.recursiveDivideBy2(this.teams.length);
    let count= 0;
    let n = this.teams.length;
    while (n !== 1) {
      n = n / 2;
      count++;
    }
    console.log(n)
    return count;
  }

  getTeam(tag: string): Observable<Team> {
    return this.teamService.getTeam(tag);
  }

  getClass() {
    return (this.team?.poster === undefined) ? "none" : "caption";
  }

  public createImgPath = (serverPath: string) => {
    return (serverPath !== undefined) ? `${environment.apiUrl}/Resources/Images/${serverPath}` : "assets/images/image_placeholder.png";
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

  getRank(key: string) {
    return getRankIcon(key);
  }

}
