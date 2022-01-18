import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-all-my-tourneys',
  templateUrl: './view-all-my-tourneys.component.html',
  styleUrls: ['./view-all-my-tourneys.component.css'],
})
export class ViewAllMyTourneysComponent implements OnInit {
  tourney: any = {
    name: 'TourneyName',
    numberOfTeams: 5,
    rank: 'GOLD',
    date: '13-01-2022',
  };
  constructor() {}

  ngOnInit(): void {}
}
