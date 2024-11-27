import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  authService.isAuthenticated.pipe(takeUntilDestroyed()).subscribe({
    next: (value) => {
      if (!value) {
        router.navigate(['']);
      }
    },
    error: (err) => {
      router.navigate(['']);
    },
  });

  return true;
};
