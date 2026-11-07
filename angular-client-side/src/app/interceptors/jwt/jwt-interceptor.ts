import { HttpRequest, HttpEvent, HttpHandlerFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

export function jwtInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const currentUser = isPlatformBrowser(inject(PLATFORM_ID))
    ? localStorage.getItem('currentUser')
    : null;
  if (currentUser) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${currentUser}`,
      },
    });
  }
  return next(req);
}
