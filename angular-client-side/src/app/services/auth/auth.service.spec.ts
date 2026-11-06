import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should decode the nickname from the JWT without storing extra localStorage values', () => {
    const payload = btoa(JSON.stringify({ unique_name: 'alice' }));
    const token = `header.${payload}.signature`;
    localStorage.setItem('currentUser', token);

    expect(service.getCurrentUserNickname()).toBe('alice');
  });

  it('should clear currentUser on logout', () => {
    localStorage.setItem('currentUser', 'jwt-token');
    service.setCurrentUser({ nickname: 'alice' } as any);

    service.logout();

    expect(localStorage.getItem('currentUser')).toBeNull();
    expect(service.currentUser).toBeNull();
  });
});
