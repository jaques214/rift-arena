import { Component, OnInit } from '@angular/core';
import { TourneyRestService } from '@services/tourney-rest/tourney-rest.service';

@Component({
  selector: 'app-view-all-my-tourneys',
  templateUrl: './view-all-my-tourneys.component.html',
  styleUrls: ['./view-all-my-tourneys.component.css'],
})
export class ViewAllMyTourneysComponent implements OnInit {
  userTourneys: any = [];

  constructor(private tourneyService: TourneyRestService) {}

  ngOnInit(): void {
    this.tourneyService.getUserTourneys().subscribe({
      next: (data: {}) => this.userTourneys = data,
      error: (err: any) => console.log(err)
    });
  }

  clickEvent(id: number) {
    return '/view-tourney/' + id; 
  }

  clickEditEvent(id: number) {
    return '/update-tourney/' + id; 
  }
}
