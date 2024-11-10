import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService: TokenService = inject(TokenService);
  const router: Router = inject(Router);

  tokenService.isAuthenticated.pipe(takeUntilDestroyed()).subscribe({
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
