import { TourneyRestService } from '@services/tourney-rest/tourney-rest.service';
import { Component, Input, OnInit } from '@angular/core';
import { Tournament } from '@src/app/models/tournament';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@src/environments/environment';

@Component({
  selector: 'app-view-tourney',
  templateUrl: './view-tourney.component.html',
  styleUrls: ['./view-tourney.component.css']
})
export class ViewTourneyComponent implements OnInit {
  tourneyId!: number;
  tourney!: Tournament
  tournaments: any = [];
  tourneysList: any = [];
  idList: any = [];

  constructor(private route: ActivatedRoute, private tourneyRestService: TourneyRestService) {
    this.tourneyId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getTournament(this.tourneyId).subscribe(tourney => {
      this.tourney = tourney;
    });
  }

  getColor(state: number): string {
    return (this.getState(state) == "Online") ? "green" : "red";
  }

  getState(state: number): string {
    let result = "";
    switch (state) {
      case 0:
        result = "Published";
        break;
      case 1:
        result = "Not Published";
        break;
      case 2:
        result = "Canceled";
        break;
      case 3:
        result = "Soon";
        break;
      case 4:
        result = "Online";
        break;
      case 5:
        result = "Closed";
        break;
      default:
        break;
    }
    return (state == 1) ? "Online" : "Offline";
  }

  public createImgPath = (serverPath: string) => {
    return `${environment.apiUrl}/Resources/Images/${serverPath}`;
  }

  getTournament(id: number) {
    return this.tourneyRestService.getTourney(id);
  }

  getTournaments() {
    return this.tourneyRestService.getTourneys();
  }

  populateTourneys() {
    this.tournaments.forEach((element: any) => {
      this.tourneysList.push(element.name);
      this.idList.push(element.tournamentId);
    });
  }

}
