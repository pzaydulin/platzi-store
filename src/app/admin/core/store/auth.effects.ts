import { inject, Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ofType, createEffect, Actions, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { catchError, concatMap, delay,  exhaustMap, filter, first, fromEvent, map, of, switchMap, tap } from 'rxjs';
import { AuthActions } from './auth.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { select, Store } from '@ngrx/store';
import { AuthState } from './auth.reducer';
import { isAuthenticated } from './auth.selectors';
import { LocalStorageService } from '../services/local-storage.service';
import { constants } from '../constants';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private store$: Store<AuthState> = inject(Store);
  private storage$ = inject(LocalStorageService);

  initEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => AuthActions.initAuthData())
    )
  );

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
      concatMap((action) =>
        of(action).pipe(
          delay((action.payload.exp ?? 1) * 1000 - 60 * 1000 - Date.now())
        )
      ),
      switchMap(() =>
        this.store$.pipe(
          select(isAuthenticated),
          first(), // запускаем счетчик только один раз после аутентификации
          filter((isAuthenticated) => isAuthenticated)
        )
      ),
      switchMap(() => this.authService.refresh()),
      map((authData) => AuthActions.loginSuccess({ payload: authData }))
    )
  );

  saveAuthDataToLocalStorage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap((action) => {
          this.storage$.setItem(
            constants.AUTH_DATA_KEY,
            JSON.stringify(action.payload)
          );
        })
      ),
    { dispatch: false }
  );

  getAuthDataFromLocalStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initAuthData, AuthActions.getDataFromStorage),
      map(() => {
        const authDataString = this.storage$.getItem(constants.AUTH_DATA_KEY);
        if (!authDataString) {
          return AuthActions.logoutSuccess();
        }
        const authData = JSON.parse(authDataString);

        // 10 sec before expires
        if (authData.exp * 1000 - 10 * 1000 - Date.now() < 0) {
          return AuthActions.logoutSuccess();
        }
        return AuthActions.loginSuccess({ payload: authData });
      })
    )
  );

  listenStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initAuthData),
      switchMap(() => fromEvent(window, 'storage')),
      map(() => AuthActions.getDataFromStorage())
    )
  );


  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      map(() => {
        this.storage$.removeItem(constants.AUTH_DATA_KEY);
        console.log("logout");
        
        return AuthActions.logoutSuccess();
      })
    )
  )
  
  // listenAuthotication$ = createEffect(
  //   () =>
  //     this.actions$.pipe(
  //       ofType(AuthActions.initAuthData),
  //       switchMap(() => this.store$.pipe(select(getAuthData))),
  //       tap((authData) => console.log('authData=>', authData)),
  //       filter((authData) => authData !== undefined),
  //       map((authData) => !!authData),
  //       distinctUntilChanged(), // compare prev and current value
  //       skip(1), // skip works of guards
  //       tap((isAuth) => {
  //         console.log('isAuth', isAuth);
  //         this.router$.navigate([isAuth ? 'products' : '']);
  //       })
  //     ),
  //   { dispatch: false }
  // );
}
