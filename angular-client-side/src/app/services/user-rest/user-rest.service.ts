import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '@models/user';
import { Request } from '@models/request';
import { LinkedList } from 'linked-list-typescript';

const endpoint = 'https://localhost:5001/api/Users';
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
  getUser(): Observable<User> {
    return this.http.get<User>(endpoint + '/withToken', httpOptions);
  }

  // retorna todos os users presentes no servidor
  getUsers(): Observable<LinkedList<User>> {
    return this.http.get<LinkedList<User>>(endpoint, httpOptions);
  }

  addAccount(username: string, region: string): Observable<any> {
    const url = `${endpoint}/vincularConta`;
    return this.http.post(url, 
      JSON.stringify({ Username: username, Region: region }),
      httpOptions);
  }

  unlinkAccount(): Observable<any> {
    const url = `${endpoint}/desvincularConta`;
    return this.http.post(url, 
      JSON.stringify({}),
      httpOptions);
  }

  // envia um user e retorna o mesmo user com a informação atualizada no servidor
  updateUser(password?: string, email?: string, poster?: string): Observable<User> {
    return this.http.put<User>(
      endpoint,
      JSON.stringify({ Password: password, Email: email, Poster: poster }),
      httpOptions
    );
  }

  createRequest(nickname: string): Observable<any> {
    const url = `${endpoint}/createRequest`;
    return this.http.post(url, 
      JSON.stringify({ Nickname: nickname }),
      httpOptions);
  }

  acceptRequest(requestID: number): Observable<any> {
    const url = `${endpoint}/acceptRequest`;
    return this.http.post(url, 
      JSON.stringify({ RequestId: requestID }),
      httpOptions);
  }

  refuseRequest(requestID: number): Observable<any> {
    const url = `${endpoint}/refuseRequest`;
    return this.http.post(url, 
      JSON.stringify({ RequestId: requestID }),
      httpOptions);
  }

  getRequests(): Observable<LinkedList<Request>> {
    return this.http.get<LinkedList<Request>>(
      endpoint + '/requests',
      httpOptions
    );
  }
}
