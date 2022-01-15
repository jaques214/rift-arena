import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTourneyComponent } from './manage-tourney.component';

describe('ManageTourneyComponent', () => {
  let component: ManageTourneyComponent;
  let fixture: ComponentFixture<ManageTourneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageTourneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
