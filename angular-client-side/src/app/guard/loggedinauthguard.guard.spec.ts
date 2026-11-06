import { TestBed } from '@angular/core/testing';

import { loggedInAuthGuard } from './loggedinauthguard.guard';

describe('LoggedinauthguardGuard', () => {
  let guard: typeof loggedInAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = loggedInAuthGuard;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
