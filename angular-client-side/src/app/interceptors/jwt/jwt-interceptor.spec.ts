import { HttpRequest, HttpResponse } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { jwtInterceptor } from './jwt-interceptor';

describe('JwtInterceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    expect(jwtInterceptor).toBeTruthy();
  });

  it('should not access localStorage during server-side rendering', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });
    const request = new HttpRequest('GET', '/');
    const next = jasmine.createSpy().and.returnValue(of(new HttpResponse()));

    TestBed.runInInjectionContext(() => jwtInterceptor(request, next));

    expect(next).toHaveBeenCalledWith(request);
  });
});
