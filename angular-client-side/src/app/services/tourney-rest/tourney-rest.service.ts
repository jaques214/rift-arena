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
  
}
