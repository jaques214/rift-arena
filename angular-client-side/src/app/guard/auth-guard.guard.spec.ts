import { TestBed } from '@angular/core/testing';

import { authGuard } from './auth-guard.guard';

describe('AuthGuardGuard', () => {
  let guard: typeof authGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = authGuard;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
