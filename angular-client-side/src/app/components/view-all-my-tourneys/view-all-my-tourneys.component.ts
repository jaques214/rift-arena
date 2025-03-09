import { Component, OnInit } from '@angular/core';
import { TourneyRestService } from '@services/tourney-rest/tourney-rest.service';
import { NgFor, NgIf } from '@angular/common';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import {Tournament} from "@models/tournament";

@Component({
    selector: 'app-view-all-my-tourneys',
    templateUrl: './view-all-my-tourneys.component.html',
    styleUrls: ['./view-all-my-tourneys.component.css'],
    standalone: true,
    imports: [
        NavBarComponent,
        NgFor,
        NgIf,
    ],
})
export class ViewAllMyTourneysComponent implements OnInit {
  userTourneys: Tournament[] = [];

  constructor(private tourneyService: TourneyRestService) {}

  ngOnInit(): void {
    this.tourneyService.getUserTourneys().subscribe({
      next: (data: Tournament[]) => this.userTourneys = data,
      error: (err) => console.log(err)
    });
  }

  clickEvent(id: number) {
    return '/view-tourney/' + id;
  }

  clickEditEvent(id: number) {
    return '/update-tourney/' + id;
  }
}
