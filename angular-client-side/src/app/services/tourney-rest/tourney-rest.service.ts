import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tournament } from '@src/app/models/tournament';
import { Observable } from 'rxjs';

const endpoint = 'https://localhost:5001/api/Tournaments/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class TourneyRestService {
  constructor(private http: HttpClient) {}

  getTourneys(): Observable<Tournament[]> {
    return this.http.get<Tournament[]>(endpoint, httpOptions);
  }

  getTourney(id: number): Observable<Tournament> {
    return this.http.get<Tournament>(endpoint + id, httpOptions);
  }

  addTeam(id: number, nickname: string) : Observable<Tournament> {
      return this.http.put<Tournament>(
        endpoint + id + '/addMyTeam',
        JSON.stringify({ Nickname: nickname }),
        httpOptions
      );
  }

  updateTourney(obj: object): Observable<Tournament> {
    return this.http.put<Tournament>(
      endpoint,
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
}
