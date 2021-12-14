import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '@models/user';

const endpoint = 'http://localhost:5001/api';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  // retorna o user com o username e password correspondente caso exista no servidor
  login(username: string, password: string): Observable<any> {
    return this.http.post<User>(
      `${endpoint}/Users/login`,
      JSON.stringify({ Nickname: username, Password: password }),
      httpOptions
    );
  }

  // retorna um novo user com o email, username e password inseridos, em caso de erro nao retorna nada
  register(
    email: string,
    username: string,
    password: string
  ): Observable<User> {
    return this.http.post<User>(
      `${endpoint}/Users/register`,
      JSON.stringify({ Nickname: username, Email: email, Password: password }),
      httpOptions
    )
  }

  // remove o user da localStorage, ou seja, remove a sua sessao
  logout():any {
    localStorage.removeItem('currentUser');
  }

  /*logout() {
    localStorage.removeItem('currentUser');
  }*/

  // verifica se o email inserido pertence a um user com conta RIOT vinculada ou nao
  verifyBoundedAccount(username: string): Observable<any> {
    return this.http.post<any>( // isto vai ser preciso alterar quando o controller no backend for feito
      endpoint + `verifyAccount`,
      { Nickname: username },
      httpOptions
    );
  }
}
