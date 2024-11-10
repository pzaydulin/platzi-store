import { DestroyRef, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { Subject, Subscription, takeUntil } from 'rxjs';

export const guestGuard: CanActivateFn = (route, state) => {

  const tokenService: TokenService = inject(TokenService);
  const router: Router = inject(Router);
  const destroy$ = new Subject();
  const destroyRef = inject(DestroyRef);

  tokenService.isAuthenticated.pipe(takeUntil(destroy$)).subscribe({
    next: (value) => {
      if (value) {
        router.navigate(['products']);
      }
    },
    error: (err) => {
      router.navigate(['']);
    },
    complete: () => {
      destroy$.next(true);
      destroy$.unsubscribe();
    },
  });

  return true;
};
