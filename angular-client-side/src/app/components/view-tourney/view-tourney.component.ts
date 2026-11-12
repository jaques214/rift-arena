import { NgOptimizedImage } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavBarComponent } from '@components/nav-bar/nav-bar.component';
import type { State, Tournament } from '@models/tournament';
import { TourneyRestService } from '@services/tourney-rest/tourney-rest.service';
import { environment } from '@src/environments/environment';

const StateRecord: Record<State, string> = {
  PUBLISHED: 'Published',
  NOT_PUBLISHED: 'Not Published',
  CANCELED: 'Canceled',
  SOON: 'Soon',
  ONLINE: 'Online',
  CLOSED: 'Closed',
};

@Component({
  selector: 'app-view-tourney',
  templateUrl: './view-tourney.component.html',
  styleUrls: ['./view-tourney.component.css'],
  imports: [NavBarComponent, MatButtonModule, RouterLink, NgOptimizedImage],
})
export class ViewTourneyComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private tourneyRestService = inject(TourneyRestService);

  tourneyId: number = this.route.snapshot.params['id'];
  tourney!: Tournament;
  tournaments: Tournament[] = [];
  tourneysList: string[] = [];
  idList: number[] = [];

  ngOnInit(): void {
    this.getTournament(this.tourneyId).subscribe((tourney) => {
      this.tourney = tourney;
    });
  }

  getColor(state: State): string {
    return this.getState(state) === 'Online' ? 'green' : 'red';
  }

  getState(state: State): string {
    return StateRecord[state] || 'Offline';
  }

  public createImgPath = (serverPath: string) => {
    return `${environment.apiUrl}/Resources/Images/${serverPath}`;
  };

  getTournament(id: number) {
    return this.tourneyRestService.getTourney(id);
  }

  getTournaments() {
    return this.tourneyRestService.getTourneys();
  }

  populateTourneys() {
    this.tournaments.forEach((element: Tournament) => {
      this.tourneysList.push(element.name);
      this.idList.push(element.tournamentId);
    });
  }
}
