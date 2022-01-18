import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllTourneysComponent } from './view-all-tourneys.component';

describe('ViewAllTourneysComponent', () => {
  let component: ViewAllTourneysComponent;
  let fixture: ComponentFixture<ViewAllTourneysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAllTourneysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllTourneysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
