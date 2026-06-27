import { HttpRequest, HttpEvent, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';

export function jwtInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const currentUser = (typeof localStorage !== 'undefined') ? localStorage.getItem('currentUser') : null;
  if (currentUser) {
    req = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${currentUser}`,
      },
    });
  }
  return next(req);
}
