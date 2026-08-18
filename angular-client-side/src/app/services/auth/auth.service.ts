import {inject, Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@src/environments/environment';
import {Router} from "@angular/router";
import { User } from '@models/user';

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
  private http = inject(HttpClient);
  currentUser: User | null = null;

  setCurrentUser(user: User | null): void {
    this.currentUser = user;
  }

  getCurrentUserNickname(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const token = localStorage.getItem('currentUser');
    if (!token || token.split('.').length < 2) {
      return null;
    }

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
      const decoded = atob(padded);
      const payload = JSON.parse(decoded);
      return payload?.unique_name ?? payload?.name ?? payload?.nickname ?? null;
    } catch {
      return null;
    }
  }

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

  /**
   * Adds the user login though HTTP POST request
   * @param username the user's nickname
   * @param password the user's password
   * @return an observable user if it exists in the server
   */
  login(username: string, password: string) {
    return this.http.post<any>(
      `${endpoint}/Users/login`,
      JSON.stringify({ Nickname: username, Password: password }),
      httpOptions
    );
  }

  /**
   * Adds the user register though HTTP POST request
   * @param email the user's email
   * @param username the user's nickname
   * @param password the user's password
   * @return a new user if valid or else it returns nothing
   */
  register(email: string, username: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${endpoint}/Users/register`,
      JSON.stringify({ Nickname: username, Email: email, Password: password }),
      httpOptions
    );
  }

  // remove o user da localStorage, ou seja, remove a sua sessao
  logout() {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
  }

  // verifica se o email inserido pertence a um user com conta RIOT vinculada ou nao
  verifyBoundedAccount(): Observable<any> {
    return this.http.post<any>( // isto vai ser preciso alterar quando o controller no backend for feito
      endpoint + `verifyAccount`,
      httpOptions
    );
  }
}
