import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '@src/app/models/user';

const endpoint = 'https://localhost:5001/api/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Acess-Control-Allow-Origin': '*',
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
      endpoint + 'Users/login',
      { Username: username, Password: password },
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
      endpoint + 'Users/register',
      { Nickname: username, Email: email, Password: password },
      httpOptions
    );
  }

  // remove o user da localStorage, ou seja, remove a sua sessao
  logout() {
    localStorage.removeItem('currentUser');
  }

  // verifica se o email inserido pertence a um user com conta RIOT vinculada ou nao
  verifyBoundedAccount(username: string): Observable<any> {
    return this.http.post<any>( // isto vai ser preciso alterar quando o controller no backend for feito
      endpoint + `verifyAccount`,
      { Nickname: username },
      httpOptions
    );
  }
}
