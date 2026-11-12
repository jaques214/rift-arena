import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Team } from '@models/team';
import { environment } from '@src/environments/environment';
import type { Observable } from 'rxjs';

const endpoint = `${environment.apiUrl}/api/Teams/`;
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
  private http = inject(HttpClient);

  // por enquanto está ID mas com a alteraçao vai ser pela TAG
  getTeam(tag: string): Observable<Team> {
    return this.http.get<Team>(`${endpoint}${tag}`, httpOptions);
  }

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(endpoint, httpOptions);
  }

  updateTeam(obj: object): Observable<Team> {
    return this.http.put<Team>(
      endpoint,
      // { Name: name, Tag: tag, Poster: poster }
      JSON.stringify(obj),
      httpOptions,
    );
  }

  removeMember(nickname: string) {
    return this.http.delete<void>(`${endpoint}removeMember`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        Nickname: nickname,
      },
    });
  }

  deleteTeam(): Observable<void> {
    return this.http.delete<void>(endpoint, httpOptions);
  }

  createTeam(tag: string, nameTeam: string): Observable<void> {
    return this.http.post<void>(
      `${endpoint}createTeam`,
      JSON.stringify({
        Name: nameTeam,
        Tag: tag,
      }),
      httpOptions,
    );
  }
}
