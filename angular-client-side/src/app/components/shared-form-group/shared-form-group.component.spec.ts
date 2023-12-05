import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedFormGroupComponent } from './shared-form-group.component';

describe('SharedFormGroupComponent', () => {
  let component: SharedFormGroupComponent;
  let fixture: ComponentFixture<SharedFormGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SharedFormGroupComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedFormGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
