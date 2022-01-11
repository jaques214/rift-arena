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
  team!: Team;
  searchText!: string;
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

  // applyFilter(event: Event) {
  //   const filter = (event.target as HTMLInputElement).value;

  //   let input, div, i, txtValue;
  //   input = document.getElementById('input');
  //   div = document.getElementsByClassName('team-content');

  //   // Loop through all list items, and hide those who don't match the search query
  //   for (i = 0; i < div.length; i++) {
  //     txtValue = a.textContent || a.innerText;
  //     if (txtValue.toUpperCase().indexOf(filter) > -1) {
  //       li[i].style.display = "";
  //     } else {
  //     li[i].style.display = "none";
  //   }
  // }
  //   this.teams.filter = filterValue.trim().toLowerCase();
  // }

}
