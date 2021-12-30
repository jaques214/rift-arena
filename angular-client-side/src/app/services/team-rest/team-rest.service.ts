import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from '@models/team';

const endpoint = 'https://localhost:5001/api/Teams/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class TeamRestService {
  constructor(private http: HttpClient) {}

  // por enquanto está ID mas com a alteraçao vai ser pela TAG
  getTeam(id: number): Observable<Team> {
    return this.http.get<Team>(endpoint + `${id}`, httpOptions);
  }

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(endpoint, httpOptions);
  }

  createTeam(username: string, tag: string, nameTeam: string): Observable<any> {
    return this.http.post<any>(
      endpoint + 'createTeam',
      JSON.stringify({
        Name: nameTeam,
        Tag: tag,
        TeamLeader: username,
        Rank: 'Gold',
      })
    );
  }
}
