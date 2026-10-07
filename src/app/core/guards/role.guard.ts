import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const role = auth.userRole();
    if (role && allowedRoles.includes(role)) {
      return true;
    }
    router.navigate(['/login']);
    return false;
  };
};