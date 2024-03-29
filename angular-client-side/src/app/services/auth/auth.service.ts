import {inject, Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@src/environments/environment';
import {Router} from "@angular/router";

const endpoint = `${environment.apiUrl}/api`;
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
  constructor(private http: HttpClient) { }

  async canActivate(): Promise<boolean> {
    const router = inject(Router)
    if (localStorage.getItem('currentUser') && localStorage.getItem('currentUser') != null) {
      return true;
    }
    //router.navigate(['/login']);
    return await router.navigate(['/login']);
  }

  async loggedIn(): Promise<boolean> {
    const router = inject(Router)
    if (
      localStorage.getItem('currentUser') &&
      localStorage.getItem('currentUser') != null
    ) {
      return await router.navigate(['']);
    }
    return true;
  }

  // retorna o user com o username e password correspondente caso exista no servidor
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${endpoint}/Users/login`,
      JSON.stringify({ Nickname: username, Password: password }),
      httpOptions
    );
  }

  // retorna um novo user com o email, username e password inseridos, em caso de erro nao retorna nada
  register(email: string, username: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${endpoint}/Users/register`,
      JSON.stringify({ Nickname: username, Email: email, Password: password }),
      httpOptions
    );
  }

  // remove o user da localStorage, ou seja, remove a sua sessao
  logout(): any {
    localStorage.removeItem('currentUser');
  }

  // verifica se o email inserido pertence a um user com conta RIOT vinculada ou nao
  verifyBoundedAccount(): Observable<any> {
    return this.http.post<any>( // isto vai ser preciso alterar quando o controller no backend for feito
      endpoint + `verifyAccount`,
      httpOptions
    );
  }
}
