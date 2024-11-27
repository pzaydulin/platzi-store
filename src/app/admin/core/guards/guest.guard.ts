import { DestroyRef, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = (route, state) => {

  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  const destroy$ = new Subject();
  const destroyRef = inject(DestroyRef);

  authService.isAuthenticated.pipe(takeUntil(destroy$)).subscribe({
    next: (value) => {
      if (value) {
        console.log('User is authenticated...');
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
