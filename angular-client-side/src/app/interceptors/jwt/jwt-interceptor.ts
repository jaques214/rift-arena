import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
    let currentUser = localStorage.getItem('currentUser')!;
    if (currentUser) {
      req = req.clone({
        setHeaders: {
          'Authorization': `Bearer ${currentUser}`,
        },
      });
    }
    return handler.handle(req);
  }
}
