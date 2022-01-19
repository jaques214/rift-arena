import { Component, OnInit } from '@angular/core';
import { TourneyRestService } from '@src/app/services/tourney-rest/tourney-rest.service';

@Component({
  selector: 'app-view-all-my-tourneys',
  templateUrl: './view-all-my-tourneys.component.html',
  styleUrls: ['./view-all-my-tourneys.component.css'],
})
export class ViewAllMyTourneysComponent implements OnInit {
  tourneys: any = [
    {
      name: 'TourneyName',
      numberOfTeams: 5,
      rank: 'GOLD',
      date: '13-01-2022',
      posted: false,
      state: 'finished',
    },
    {
      name: 'TourneyName1',
      numberOfTeams: 2,
      rank: 'GOLD',
      date: '13-01-2022',
      posted: true,
      state: 'finished',
    },
    {
      name: 'TourneyName2',
      numberOfTeams: 5,
      rank: 'GOLD',
      date: '13-01-2022',
      posted: false,
      state: 'ingame',
    },
    {
      name: 'TourneyName3',
      numberOfTeams: 5,
      rank: 'GOLD',
      date: '13-01-2022',
      posted: false,
      state: 'finished',
    },
    {
      name: 'TourneyName4',
      numberOfTeams: 5,
      rank: 'GOLD',
      date: '13-01-2022',
      posted: false,
      state: 'finished',
    },
    {
      name: 'TourneyName2',
      numberOfTeams: 5,
      rank: 'GOLD',
      date: '13-01-2022',
      posted: true,
      state: 'finished',
    },
    {
      name: 'TourneyName2',
      numberOfTeams: 5,
      rank: 'GOLD',
      date: '13-01-2022',
      posted: false,
      state: 'ingame',
    },
    {
      name: 'TourneyName2',
      numberOfTeams: 5,
      rank: 'GOLD',
      date: '13-01-2022',
      posted: true,
      state: 'finished',
    },
  ];

  userTourneys: any = [];

  constructor(private tourneyService: TourneyRestService) {}

  ngOnInit(): void {
    this.tourneyService.getUserTourneys().subscribe(
      (data) => {
        this.userTourneys = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  clickEvent(id: number) {
    return '/view-tourney/' + id; 
  }
}
