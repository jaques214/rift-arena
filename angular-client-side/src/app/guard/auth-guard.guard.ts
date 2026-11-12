import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';

export const authGuard: CanActivateFn = (): Promise<boolean> => {
  return inject(AuthService).canActivate();
};
