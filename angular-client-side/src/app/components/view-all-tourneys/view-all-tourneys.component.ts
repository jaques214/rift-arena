import { Observable } from 'rxjs';
import { TourneyRestService } from './../../services/tourney-rest/tourney-rest.service';
import { Component, OnInit } from '@angular/core';
import { Tournament } from '@src/app/models/tournament';

@Component({
  selector: 'app-view-all-tourneys',
  templateUrl: './view-all-tourneys.component.html',
  styleUrls: ['./view-all-tourneys.component.css']
})
export class ViewAllTourneysComponent implements OnInit {
  //tournaments: any = [];
  tournament = {
    tournamentId: 1,
    name: "Torneio Exemplo",
    description: "Este torneio é um máximo.",
    rank: "IRON",
    region: "euw1",
    poster: "assets/images/238-300x200.jpg",
    prize: 5000,
    state: 1,
    date: "2022-10-31 09:30",
    maxTeams: 4
}
  tournaments: any = [this.tournament, this.tournament];

  constructor(private tourneyRestService: TourneyRestService) { }

  ngOnInit(): void {
    console.log(this.tournaments);
    // this.getTournaments().subscribe((data: {}) => {
    //   this.tournaments = data;
    // });
  }

  getTournaments() {
    return this.tourneyRestService.getTourneys();
  }
}
