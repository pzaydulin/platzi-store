import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  inject(TokenService).isAuthenticated.subscribe({
    next: (value) => {
      console.log(value);
      
      if (!value) {
        inject(Router).navigate(['']);
      }
    }
  });

  return true;

};
