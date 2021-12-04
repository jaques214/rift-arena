import { TestBed } from '@angular/core/testing';

import { TeamRestService } from './team-rest.service';

describe('TeamRestService', () => {
  let service: TeamRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
