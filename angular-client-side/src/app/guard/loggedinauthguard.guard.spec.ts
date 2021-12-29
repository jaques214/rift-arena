import { TestBed } from '@angular/core/testing';

import { LoggedInAuthGuard } from './loggedinauthguard.guard';

describe('LoggedinauthguardGuard', () => {
  let guard: LoggedInAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LoggedInAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
