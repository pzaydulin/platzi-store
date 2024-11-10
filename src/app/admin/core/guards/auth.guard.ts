import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { inject } from '@angular/core';
import { Subject } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {

  const destroy$ = new Subject();

  inject(TokenService).isAuthenticated.subscribe({
    next: (value) => {
      if (!value) {
        inject(Router).navigate(['']);
      }
    },
    error: (err) => {
        inject(Router).navigate(['']);
    },
    complete: () => {
      destroy$.next(true);
      destroy$.unsubscribe();
    }
  });

  return true;

};
