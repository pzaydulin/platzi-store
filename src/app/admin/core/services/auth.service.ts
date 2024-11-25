import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ILogin, ILoginResponse } from '../models/auth.model';
import { apiEndpoint } from '../constants';
import { map, Observable } from 'rxjs';
import { TokenService } from './token.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http: HttpClient = inject(HttpClient);
  private tokenService: TokenService = inject(TokenService);

  constructor() {}

  login(credentials: ILogin): Observable<ILoginResponse> {
    return this.http
      .post<ILoginResponse>(apiEndpoint.AUTH_LOCAL.LOGIN, credentials)
      .pipe(
        map((response) => {
          if (response) {
            this.tokenService.setToken(response.accessToken);
          }
          return {
            ...response,
            ...jwtDecode(response.accessToken),
          };
        })
      );
  }

  profile(): Observable<any> {
    return this.http.get<any>(apiEndpoint.AUTH_LOCAL.PROFILE)
  }

  logout() {}
}
