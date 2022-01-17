import { UserRestService } from './../../services/user-rest/user-rest.service';
import { Observable } from 'rxjs';
import { TeamRestService } from '@services/team-rest/team-rest.service';
import { TourneyRestService } from '@services/tourney-rest/tourney-rest.service';
import { Component, OnInit } from '@angular/core';
import { Tournament } from '@models/tournament';
import { Team } from '@models/team';
import { User } from '@src/app/models/user';

@Component({
  selector: 'app-join-tournament',
  templateUrl: './join-tournament.component.html',
  styleUrls: ['./join-tournament.component.css']
})
export class JoinTournamentComponent implements OnInit {
  tourney!: Tournament;
  teams: any = [];
  userNickname!:string;
  user!:User;

  constructor(private tournamentRestService: TourneyRestService,
     private teamRestService: TeamRestService,
     private userRestService: UserRestService) { }

  ngOnInit(): void {
    this.getUser().subscribe((user) => {
      this.userNickname = user.nickname!;
    });

    this.getTournament(1).subscribe(tourney => {
      this.tourney = tourney;
    });

    this.getTeams().subscribe((data: {}) => {
        this.teams = data;
    });
  }

  getTournament(id: number) {
    return this.tournamentRestService.getTourney(id);
  }

  getTeams(): Observable<Team[]> {
    return this.teamRestService.getTeams();
  }

  getUser() {
    return this.userRestService.getUser();
  }

  addTeam(id: number, nickname: string) {
    this.tournamentRestService.addTeam(id, nickname).subscribe({
      next: () => {
        this.getUser().subscribe((user) => {
          this.userNickname = user.nickname!;
        });
      },
      error: (err) => console.log(err)
    });
  }
}
