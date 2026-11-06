import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { AuthService } from '@services/auth/auth.service';
import { SharedFormGroupComponent } from './shared-form-group.component';

describe('SharedFormGroupComponent', () => {
  let component: SharedFormGroupComponent;
  let fixture: ComponentFixture<SharedFormGroupComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['login', 'register']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    Object.defineProperty(router, 'url', { value: '/login', writable: true });
    router.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [SharedFormGroupComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedFormGroupComponent);
    component = fixture.componentInstance;
    component.authForm = new FormGroup({
      nickname: new FormControl('alice'),
      password: new FormControl('secret'),
    });
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should store the JWT returned by the backend after login', () => {
    authService.login.and.returnValue(of({ Token: 'jwt-token-123' }));

    component.login();

    expect(localStorage.getItem('currentUser')).toBe('jwt-token-123');
  });
});
