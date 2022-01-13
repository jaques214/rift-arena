import { TestBed } from '@angular/core/testing';

import { TourneyRestService } from './tourney-rest.service';

describe('TourneyRestService', () => {
  let service: TourneyRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TourneyRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
