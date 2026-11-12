import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import type { FieldInput } from '@src/app/shared/utils';
import { of } from 'rxjs';
import { SharedFormGroupComponent } from './shared-form-group.component';

describe('SharedFormGroupComponent', () => {
  let component: SharedFormGroupComponent;
  let fixture: ComponentFixture<SharedFormGroupComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', [
      'login',
      'register',
      'setCurrentUser',
    ]);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    Object.defineProperty(router, 'url', { value: '/login', writable: true });
    router.navigate.and.returnValue(Promise.resolve(true));
    authService.setCurrentUser.and.stub();

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
    fixture.componentRef.setInput(
      'authForm',
      new FormGroup({
        nickname: new FormControl('alice'),
        password: new FormControl('secret'),
      }),
    );
    fixture.componentRef.setInput('formFields', [
      {
        id: 'nickname',
        name: 'nickname',
        type: 'text',
        label: 'Nickname',
        placeholder: 'Nickname',
        iconLabel: 'Nickname',
        icon: 'person',
      },
      {
        id: 'password',
        name: 'password',
        type: 'password',
        label: 'Password',
        placeholder: 'Password',
        iconLabel: 'Password',
        icon: 'lock',
      },
    ] satisfies FieldInput[]);
    fixture.componentRef.setInput('value', 'Login');
    localStorage.clear();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return valid autocomplete values for password fields', () => {
    expect(component.getAutoCompleteValue('password')).toBe('current-password');
    expect(component.getAutoCompleteValue('new_password')).toBe('new-password');
  });

  it('should store the JWT returned by the backend after login', () => {
    authService.login.and.returnValue(of({ token: 'jwt-token-123' }));

    component.login();

    expect(localStorage.getItem('currentUser')).toBe('jwt-token-123');
  });
});
