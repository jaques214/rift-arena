import { LinkedAccount } from '@models/linked_acount';
import { TeamRestService } from '@services/team-rest/team-rest.service';
import { UserRestService } from '@services/user-rest/user-rest.service';
import { Component, OnInit } from '@angular/core';
import { Team } from '@models/team';
import { User } from '@models/user';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LinkedList } from 'linked-list-typescript';

@Component({
  selector: 'app-view-team',
  templateUrl: './view-team.component.html',
  styleUrls: ['./view-team.component.css']
})
export class ViewTeamComponent implements OnInit {
  user?: string;
  nickname!: string;
  teams: any = [];
  team?: Team;
  rankIcon!: string;
  displayedColumns = ['icon', 'nickname'];
  ELEMENT_DATA: PeriodicElement[] = [];
  dataSource: any;
  id?: number;
  users: any = [];
  isShow = true;
  selectedValue!: string;

  constructor(private router: Router, private teamService: TeamRestService, private restService: UserRestService) { }

  ngOnInit(): void {
    this.getUsers().subscribe((data: {}) => {
      this.users = data;
    });
    // console.log(this.teams);
    // this.restService.getUser().subscribe((user) => {
    //   this.user = user.teamTag;
    //   console.log(this.user);
    //   const found = this.teams.find(element => element.tag = this.user)
    //   console.log(found);
    //   //return this.teamService.getTeam(1);
    // });
    this.restService.getUser().subscribe((user) => {
      this.user = user.teamTag!;
      this.nickname = user.nickname!;
      console.log(this.user);
      console.log(this.nickname);
      this.getTeams().subscribe((data: {}) => {
        // console.log(data);
        // console.log(this.team);
       
          this.teams = data;
          //console.log(this.user);
          //const found = this.teams.find((element:any) => element.tag == this.user)
          (this.team as any) = this.getTeam();
          //console.log(found);
        console.log(this.teams);
      });
    });
    // this.restService.getUser().subscribe((user) => {
    //   this.getTeam().subscribe((team) => {
    //     this.team = team;
    //     console.log(this.team);
    //     this.populateTable();
    //     this.dataSource = this.ELEMENT_DATA;
    //     console.log(this.ELEMENT_DATA);
    //     this.user = user.teamId;
    //     console.log(this.user);
    //     console.log(this.team?.tag);
    //     if(this.user == this.team?.tag) {
    //       this.id = this.team?.teamId;
    //     }
    //     console.log(this.id);
    //   });
    // });
    //this.getUser();
  }

  // getTeam() {
  
  //   this.restService.getUser().subscribe((user) => {
  //     this.user = user.teamTag;
  //     console.log(this.user);
  //     //return this.teamService.getTeam(1);
  //   });
  // }

  toggleDisplay() {
    this.isShow = !this.isShow;
  }
  
addRequest(): void {
  this.restService.createRequest(this.selectedValue).subscribe({
    next: () => this.router.navigate(['/']),
    error: (err) => console.log(err)
  });
}


  getTeam(): Observable<Team> {
    const found = this.teams.find((element:any) => element.tag == this.user)
    //console.log(found);
    return found;
  }

  getTeams(): Observable<Team[]> {
    return this.teamService.getTeams();
  }

  getUser() {
    this.restService.getUser();
  }

  getUsers(): Observable<LinkedList<User>> {
    return this.restService.getUsers();
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

  getRankIcon(key: any) {
    switch (key) {
      case 'IRON':
        this.rankIcon = './assets/images/ranked-emblems/Emblem_Iron.png';
        break;
      case 'BRONZE':
        this.rankIcon = './assets/images/ranked-emblems/Emblem_Bronze.png';
        break;
      case 'SILVER':
        this.rankIcon = './assets/images/ranked-emblems/Emblem_Silver.png';
        break;
      case 'GOLD':
        this.rankIcon = './assets/images/ranked-emblems/Emblem_Gold.png';
        break;
      case 'PLATINUM':
        this.rankIcon = './assets/images/ranked-emblems/Emblem_Platinum.png';
        break;
      case 'DIAMOND':
        this.rankIcon = './assets/images/ranked-emblems/Emblem_Diamond.png';
        break;
      case 'GRANDMASTER':
        this.rankIcon = './assets/images/ranked-emblems/Emblem_Grandmaster.png';
        break;
      case 'MASTER':
        this.rankIcon = './assets/images/ranked-emblems/Emblem_Master.png';
        break;
      case 'CHALLENGER':
        this.rankIcon = './assets/images/ranked-emblems/Emblem_Challenger.png';
        break;
      default:
        this.rankIcon = './assets/images/ranked-emblems/Emblem_Bronze.png';
        break;
    }
    return this.rankIcon;
  }

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
