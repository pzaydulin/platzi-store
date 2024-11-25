import { inject, Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ofType, createEffect, Actions } from '@ngrx/effects';
import { catchError, concatMap, delay, exhaustMap, filter, first, map, of, switchMap } from 'rxjs';
import { AuthActions } from './auth.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { select, Store } from '@ngrx/store';
import { AuthState } from './auth.reducer';
import { isAuthenticated } from './auth.selectors';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private store$: Store<AuthState> = inject(Store)

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap((credential) =>
        this.authService.login(credential).pipe(
          map((accessToken) =>
            AuthActions.loginSuccess({ payload: accessToken })
          ),
          catchError((err: HttpErrorResponse) => {
            return of(
              AuthActions.loginFailure({ serverError: err.statusText })
            );
          })
        )
      )
    )
  );

  refresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      concatMap((action) => of(action).pipe(
        delay((action.payload.exp ?? 1) * 1000 - 60 * 1000 - Date.now())
      )),
      switchMap(() => this.store$.pipe(
        select(isAuthenticated),
        first(), // запускаем счетчик только один раз после аутентификации
        filter(isAuthenticated => isAuthenticated),
      )),
      switchMap(() =>
        this.authService
          .refresh()
          .pipe(
            map((authData) => AuthActions.loginSuccess({ payload: authData }))
          )
      )
    )
  );
}
