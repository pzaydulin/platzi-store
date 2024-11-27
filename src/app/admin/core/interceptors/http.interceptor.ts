import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/local-storage.service';
import { constants } from '../constants';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {

  const authService: AuthService = inject(AuthService);
  const storage: LocalStorageService = inject(LocalStorageService);
  const router: Router = inject(Router);

  authService.isAuthenticated.pipe(takeUntilDestroyed()).subscribe({
    next: (isAuthenticated) => {
      if (isAuthenticated) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${authService.accessToken}`,
          },
        });
      }
    },
  });

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        storage.removeItem(constants.AUTH_DATA_KEY);
        router.navigate(['']);
      }
      return throwError(() => error);
    })
  );
};
