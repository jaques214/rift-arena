import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedFormFieldComponent } from './shared-form-field.component';

describe('SharedFormFieldComponent', () => {
  let component: SharedFormFieldComponent;
  let fixture: ComponentFixture<SharedFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedFormFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
