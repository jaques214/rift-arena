import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTourneyComponent } from './create-tourney.component';

describe('CreateTourneyComponent', () => {
  let component: CreateTourneyComponent;
  let fixture: ComponentFixture<CreateTourneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTourneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
