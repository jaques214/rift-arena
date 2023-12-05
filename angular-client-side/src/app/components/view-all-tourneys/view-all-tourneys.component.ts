import { TourneyRestService } from '@services/tourney-rest/tourney-rest.service';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { environment } from '@src/environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor } from '@angular/common';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
    selector: 'app-view-all-tourneys',
    templateUrl: './view-all-tourneys.component.html',
    styleUrls: ['./view-all-tourneys.component.css'],
    standalone: true,
    imports: [NavBarComponent, NgIf, NgFor, MatButtonModule, RouterLink]
})
export class ViewAllTourneysComponent implements OnInit {
  tournaments: any = [];

  constructor(private router: Router, private tourneyRestService: TourneyRestService) { }

  ngOnInit(): void {
    this.getTournaments().subscribe((data: {}) => {
      this.tournaments = data;
    });
  }

  getColor(state: number): string {
    return (this.getState(state) == "Online") ? "green" : "red";
  }

  clickEvent(id: number) {
    return '/view-tourney/' + id;
  }

  getState(state: number): string {
    return (state == 1) ? "Online" : "Offline";
  }

  public createImgPath = (serverPath: string) => {
    return `${environment.apiUrl}/Resources/Images/${serverPath}`;
  }

  getTournaments() {
    return this.tourneyRestService.getTourneys();
  }
}
