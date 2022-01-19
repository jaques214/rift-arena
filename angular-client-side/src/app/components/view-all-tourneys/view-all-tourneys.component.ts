import { TourneyRestService } from '@services/tourney-rest/tourney-rest.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-all-tourneys',
  templateUrl: './view-all-tourneys.component.html',
  styleUrls: ['./view-all-tourneys.component.css']
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
    return `https://localhost:5001/Resources/Images/${serverPath}`;
  }

  getTournaments() {
    return this.tourneyRestService.getTourneys();
  }
}
