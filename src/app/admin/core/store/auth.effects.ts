import { inject, Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ofType, createEffect, Actions } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { AuthActions } from './auth.actions';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap((credential) =>
        this.authService.login(credential).pipe(
          map((accessToken) => AuthActions.loginSuccess({payload: accessToken} )),
          catchError((err:HttpErrorResponse) => {
              return of(AuthActions.loginFailure({ serverError: err.statusText }))
            }
          )
        )
      )
    )
  );
}
