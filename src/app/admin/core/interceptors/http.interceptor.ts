import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { TokenService } from '../services/token.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, throwError } from 'rxjs';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {

  const tokenService: TokenService = inject(TokenService);
  const router: Router = inject(Router);

  tokenService.isAuthenticated.pipe(takeUntilDestroyed()).subscribe({
    next: (isAuthenticated) => {
      if (isAuthenticated) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${tokenService.getToken()}`
          }
        })
      }
    }
  })

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        tokenService.removeToken();
        router.navigate(['']);
      }
      return throwError(() => error.message || error.statusText);
    })
  );
};
