import { TestBed } from '@angular/core/testing';

import { LoadingCircleService } from './loading-circle.service';

describe('LoadingCircleService', () => {
  let service: LoadingCircleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingCircleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
