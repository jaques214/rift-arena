import { environment } from '@environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '@models/user';
import { Request } from '@models/request';

const endpoint = `${environment.apiUrl}/api/Users`;
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
  constructor(private http: HttpClient) { }

  // retorna um user com o mesmo id inserido, caso contrário nada retorna
  getUser(): Observable<User> {
    return this.http.get<User>(endpoint + '/withToken', httpOptions);
  }

  // retorna todos os users presentes no servidor
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(endpoint, httpOptions);
  }

  removeProfile() {
    return this.http.delete<any>(
      endpoint,
      httpOptions
    );
  }

  addAccount(username: string, region: string): Observable<any> {
    const url = `${endpoint}/vincularConta`;
    return this.http.post(url,
      JSON.stringify({ Username: username, Region: region }),
      httpOptions);
  }

  updateRiotAccount(username: string, region: string): Observable<any> {
    const url = `${endpoint}/updateRiot`;
    return this.http.post<any>(
      url,
      JSON.stringify({ Username: username, Region: region }),
      //JSON.stringify({ Password: password, Email: email, Poster: poster }),
      httpOptions
    );
  }

  unlinkAccount(): Observable<any> {
    const url = `${endpoint}/desvincularConta`;
    return this.http.post(url,
      JSON.stringify({}),
      httpOptions);
  }

  // envia um user e retorna o mesmo user com a informação atualizada no servidor
  updateUser(obj: object): Observable<User> {
    return this.http.put<User>(
      endpoint,
      JSON.stringify(obj),
      //JSON.stringify({ Password: password, Email: email, Poster: poster }),
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

  getRequests(): Observable<Request[]> {
    return this.http.get<Request[]>(
      endpoint + '/requests',
      httpOptions
    );
  }
}
