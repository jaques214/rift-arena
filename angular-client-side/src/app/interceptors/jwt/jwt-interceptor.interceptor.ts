import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let currentUser = localStorage.getItem('currentUser')!;
    if (currentUser) {
      request = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${currentUser}`,
        },
      });
    }
    return next.handle(request);
  }
}
