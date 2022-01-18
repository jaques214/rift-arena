import { TourneyRestService } from '@services/tourney-rest/tourney-rest.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-all-tourneys',
  templateUrl: './view-all-tourneys.component.html',
  styleUrls: ['./view-all-tourneys.component.css']
})
export class ViewAllTourneysComponent implements OnInit {
  tournaments: any = [];

  constructor(private tourneyRestService: TourneyRestService) { }

  ngOnInit(): void {
    this.getTournaments().subscribe((data: {}) => {
      this.tournaments = data;
    });
  }

  getColor(state: number): string {
    return (this.getState(state) == "Online") ? "green" : "red";
  }

  getState(state: number): string {
    return (state == 1) ? "Online" : "Offline";
  }

  getTournaments() {
    return this.tourneyRestService.getTourneys();
  }
}
