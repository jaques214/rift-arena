import { TestBed } from '@angular/core/testing';

import { authGuard } from './auth-guard.guard';

describe('AuthGuardGuard', () => {
  let guard: authGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(authGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
