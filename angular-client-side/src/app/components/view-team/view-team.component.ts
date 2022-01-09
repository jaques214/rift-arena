import { TeamRestService } from '@services/team-rest/team-rest.service';
import { UserRestService } from '@services/user-rest/user-rest.service';
import { Component, OnInit } from '@angular/core';
import { Team } from '@models/team';
import { User } from '@models/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-view-team',
  templateUrl: './view-team.component.html',
  styleUrls: ['./view-team.component.css']
})
export class ViewTeamComponent implements OnInit {
  user?: string;
  teams: Team[] = [];
  team?: Team;
  displayedColumns = ['icon', 'nickname'];
  ELEMENT_DATA: PeriodicElement[] = [];
  dataSource: any;
  id?: number;

  constructor(private teamService: TeamRestService, private restService: UserRestService) { }

  ngOnInit(): void {
    this.restService.getUser().subscribe((user) => {
      this.getTeam().subscribe((team) => {
        this.team = team;
        console.log(this.team);
        this.populateTable();
        this.dataSource = this.ELEMENT_DATA;
        console.log(this.ELEMENT_DATA);
        this.user = user.teamTag;
        console.log(this.team?.tag);
        if(this.user == this.team?.tag) {
          this.id = this.team?.teamId;
        }
        console.log(this.id);
        console.log(this.user);
      });
    });
    //this.getUser();
  }

  getTeam(): Observable<Team> {
  
    // let teamTag = this.getUser();
    // console.log(this.teams.indexOf(teamTag));
    return this.teamService.getTeam(1);
  }

  // getUser() {
  //   this.restService.getUser().subscribe((user) => {
  //     this.user = user.teamTag;
  //     if(this.user == this.team?.tag) {
  //       this.id = user.teamId;
  //     }
  //     console.log(this.id);
  //     console.log(this.user);
  //   });
  // }

  populateTable() {
    const tam = this.team?.numberMembers;
    for (let index = 0; index < tam!; index++) {
      this.ELEMENT_DATA[index] = {
        icon: '', 
        nickname: this.team?.members![index].nickname!
      };
    }
  }

  getCompletePercentage(numberMembers: number) {
    let percentage = (numberMembers * 100)/5;
    return percentage;
  }
}

export interface PeriodicElement {
  icon: string;
  nickname: string;
}
