import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountFormGroupComponent } from './account-form-group.component';

describe('AccountFormGroupComponent', () => {
  let component: AccountFormGroupComponent;
  let fixture: ComponentFixture<AccountFormGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AccountFormGroupComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountFormGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
