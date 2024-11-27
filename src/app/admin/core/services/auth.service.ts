import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ILogin, ILoginResponse } from '../models/auth.model';
import { apiEndpoint } from '../constants';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AuthData } from '../store/auth.reducer';
import { Store } from '@ngrx/store';
import { getAccessToken } from '../store/auth.selectors';
import { AuthActions } from '../store/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http: HttpClient = inject(HttpClient);
  private store$ = inject(Store);

  public isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public accessToken?: string;

  constructor() {
    this.store$.select(getAccessToken).subscribe((token) => {
      this.accessToken = token;
      console.log('token changed: ', token);
      this.isAuthUpdate(!!token);
    });
  }

  isAuthUpdate(status: boolean): void {
    this.isAuthenticated.next(status);
  }

  login(credentials: ILogin): Observable<ILoginResponse> {
    return this.http
      .post<ILoginResponse>(apiEndpoint.AUTH_LOCAL.LOGIN, credentials)
      .pipe(
        map((response) => {
          return {
            ...response,
            ...jwtDecode(response.accessToken),
          };
        })
      );
  }

  refresh(): Observable<AuthData> {
    return this.http
      .post<AuthData>(apiEndpoint.AUTH_LOCAL.REFRESH_TOKEN, {})
      .pipe(
        map((response) => {
          return {
            ...response,
            ...jwtDecode(response.accessToken),
          };
        })
      );
  }
  profile(): Observable<any> {
    return this.http.get<any>(apiEndpoint.AUTH_LOCAL.PROFILE);
  }

  logout() {
    this.store$.dispatch(AuthActions.logout())
  }
}
