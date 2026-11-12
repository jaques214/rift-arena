import { HttpClient, HttpHeaders, type HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import type { Request } from '@models/request';
import type { User } from '@models/user';
import type { Observable } from 'rxjs';

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
  private http = inject(HttpClient);

  // retorna um user com o mesmo id inserido, caso contrário nada retorna
  getUser(): Observable<User> {
    return this.http.get<User>(`${endpoint}/withToken`, httpOptions);
  }

  // retorna todos os users presentes no servidor
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(endpoint, httpOptions);
  }

  removeProfile() {
    return this.http.delete(endpoint, httpOptions);
  }

  addAccount(username: string, region: string) {
    const url = `${endpoint}/vincularConta`;
    return this.http.post(url, JSON.stringify({ Username: username, Region: region }), httpOptions);
  }

  updateRiotAccount(username: string, region: string): Observable<HttpResponse<void>> {
    const url = `${endpoint}/updateRiot`;
    return this.http.post<void>(url, JSON.stringify({ Username: username, Region: region }), {
      ...httpOptions,
      observe: 'response',
    });
  }

  unlinkAccount(): Observable<HttpResponse<void>> {
    const url = `${endpoint}/desvincularConta`;
    return this.http.post<void>(url, JSON.stringify({}), { ...httpOptions, observe: 'response' });
  }

  // envia um user e retorna o mesmo user com a informação atualizada no servidor
  updateUser(obj: object): Observable<User> {
    return this.http.put<User>(
      endpoint,
      JSON.stringify(obj),
      //JSON.stringify({ Password: password, Email: email, Poster: poster }),
      httpOptions,
    );
  }

  createRequest(nickname: string): Observable<HttpResponse<void>> {
    const url = `${endpoint}/createRequest`;
    return this.http.post<void>(url, JSON.stringify({ Nickname: nickname }), {
      ...httpOptions,
      observe: 'response',
    });
  }

  acceptRequest(requestID: number): Observable<HttpResponse<void>> {
    const url = `${endpoint}/acceptRequest`;
    return this.http.post<void>(url, JSON.stringify({ RequestId: requestID }), {
      ...httpOptions,
      observe: 'response',
    });
  }

  refuseRequest(requestID: number): Observable<HttpResponse<void>> {
    const url = `${endpoint}/refuseRequest`;
    return this.http.post<void>(url, JSON.stringify({ RequestId: requestID }), {
      ...httpOptions,
      observe: 'response',
    });
  }

  getRequests(): Observable<Request[]> {
    return this.http.get<Request[]>(`${endpoint}/requests`, httpOptions);
  }
}
