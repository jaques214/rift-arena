import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '@models/user';
import { LinkedList } from 'linked-list-typescript';

const endpoint = 'https://localhost:5001/api/Users/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class UserRestService {
  constructor(private http: HttpClient) {}

  // retorna um user com o mesmo id inserido, caso contrário nada retorna
  getUser(id: number): Observable<User> {
    return this.http.get<User>(endpoint + `${id}`, httpOptions);
  }

  // retorna todos os users presentes no servidor
  getUsers(): Observable<LinkedList<User>> {
    return this.http.get<LinkedList<User>>(endpoint, httpOptions);
  }

  // envia um user e retorna o mesmo user com a informação atualizada no servidor
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(
      endpoint,
      JSON.stringify(user),
      httpOptions
    );
  }
}
