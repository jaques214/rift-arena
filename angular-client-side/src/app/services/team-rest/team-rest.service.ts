import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from '@models/team';

const endpoint = 'https://localhost:5001/api/Teams/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class TeamRestService {
  constructor(private http: HttpClient) {}

  // por enquanto está ID mas com a alteraçao vai ser pela TAG
  getTeam(tag: String): Observable<Team> {
    return this.http.get<Team>(endpoint + tag, httpOptions);
  }

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(endpoint, httpOptions);
  }

  updateTeam(obj: object): Observable<Team> {
    return this.http.put<Team>(
      endpoint,
      // { Name: name, Tag: tag, Poster: poster }
      JSON.stringify(obj),
      httpOptions
    );
  }

  removeMember(nickname: string): Observable<any> {
    return this.http.delete<any>(
      endpoint + 'removeMember',
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        body: {
          Nickname: nickname,
        },
      }
    )
  }

  deleteTeam(): Observable<any> {
    return this.http.delete<any>(
      endpoint,
      httpOptions
    );
  }

  createTeam(tag: string, nameTeam: string): Observable<any> {
    return this.http.post<any>(
      endpoint + 'createTeam',
      JSON.stringify({
        Name: nameTeam,
        Tag: tag,
      }),
      httpOptions
    );
  }
}
