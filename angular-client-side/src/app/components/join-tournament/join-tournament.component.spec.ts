import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinTournamentComponent } from './join-tournament.component';

describe('JoinTournamentComponent', () => {
  let component: JoinTournamentComponent;
  let fixture: ComponentFixture<JoinTournamentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinTournamentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinTournamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
