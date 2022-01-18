import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllMyTourneysComponent } from './view-all-my-tourneys.component';

describe('ViewAllMyTourneysComponent', () => {
  let component: ViewAllMyTourneysComponent;
  let fixture: ComponentFixture<ViewAllMyTourneysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAllMyTourneysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllMyTourneysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
