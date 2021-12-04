import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '@models/user';
import { LinkedList } from 'linked-list-typescript';
import { Team } from '@src/app/models/team';

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
}
