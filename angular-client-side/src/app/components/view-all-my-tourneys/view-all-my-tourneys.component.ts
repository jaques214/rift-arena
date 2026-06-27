import { Component, inject, OnInit } from '@angular/core';
import { TourneyRestService } from '@services/tourney-rest/tourney-rest.service';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import {Tournament} from "@models/tournament";

@Component({
    selector: 'app-view-all-my-tourneys',
    templateUrl: './view-all-my-tourneys.component.html',
    styleUrls: ['./view-all-my-tourneys.component.css'],
    imports: [
        NavBarComponent
    ]
})
export class ViewAllMyTourneysComponent implements OnInit {
  private tourneyService = inject(TourneyRestService);

  userTourneys: Tournament[] = [];

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
