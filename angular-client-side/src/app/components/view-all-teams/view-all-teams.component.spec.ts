import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllTeamsComponent } from './view-all-teams.component';

describe('ViewAllTeamsComponent', () => {
  let component: ViewAllTeamsComponent;
  let fixture: ComponentFixture<ViewAllTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ViewAllTeamsComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
