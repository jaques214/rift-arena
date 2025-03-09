import { TourneyRestService } from '@services/tourney-rest/tourney-rest.service';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '@src/environments/environment';
import { MatButtonModule } from '@angular/material/button';
import {NgIf, NgFor, NgOptimizedImage} from '@angular/common';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import {Tournament} from "@models/tournament";

@Component({
    selector: 'app-view-all-tourneys',
    templateUrl: './view-all-tourneys.component.html',
    styleUrls: ['./view-all-tourneys.component.css'],
    standalone: true,
  imports: [NavBarComponent, NgIf, NgFor, MatButtonModule, RouterLink, NgOptimizedImage]
})
export class ViewAllTourneysComponent implements OnInit {
  tournaments: Tournament[] = [];

  constructor(private tourneyRestService: TourneyRestService) { }

  ngOnInit(): void {
    this.getTournaments().subscribe((data: Tournament[]) => {
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
