import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const guestGuard: CanActivateFn = (route, state) => {
  inject(TokenService).isAuthenticated.subscribe({
    next: (value) => {
      if (value) {
        inject(Router).navigate(['products']);
      }
    },
  });

  return true;
};
