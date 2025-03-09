import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tournament } from '@src/app/models/tournament';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import {Team} from "@models/team";

const endpoint = `${environment.apiUrl}/api/Tournaments/`;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class TourneyRestService {
  constructor(private http: HttpClient) { }

  getTourneys(): Observable<Tournament[]> {
    return this.http.get<Tournament[]>(endpoint, httpOptions);
  }

  getTourney(id: number): Observable<Tournament> {
    return this.http.get<Tournament>(endpoint + id, httpOptions);
  }

  addTeam(id: number, nickname: string): Observable<Tournament> {
    return this.http.put<Tournament>(
      endpoint + id + '/addMyTeam',
      JSON.stringify({ Nickname: nickname }),
      httpOptions
    );
  }

  updateTourney(obj: object, id: number): Observable<Tournament> {
    return this.http.put<Tournament>(
      endpoint + id,
      // { Name: name, Tag: tag, Poster: poster }
      JSON.stringify(obj),
      httpOptions
    );
  }

  createTourney(tourney: object): Observable<Tournament> {
    return this.http.post<Tournament>(
      endpoint + 'createTournament',
      tourney,
      httpOptions
    );
  }

  getUserTourneys(): Observable<Tournament[]> {
    return this.http.get<Tournament[]>(
      endpoint + 'getUserTournaments',
      httpOptions
    );
  }

  startTourney(teams: Team[], id: number): Observable<Tournament> {
    return this.http.post<Tournament>(
      endpoint + 'startTournament/' + id,
      JSON.stringify(teams),
      httpOptions
    );
  }
}
