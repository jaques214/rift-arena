import { TestBed } from '@angular/core/testing';

import { loggedInAuthGuard } from './loggedinauthguard.guard';

describe('LoggedinauthguardGuard', () => {
  let guard: loggedInAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(loggedInAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
