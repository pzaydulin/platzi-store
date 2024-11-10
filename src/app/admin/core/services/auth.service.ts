import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ILogin, ILoginResponse } from '../models/auth.model';
import { apiEndpoint } from '../constants';
import { map } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http: HttpClient = inject(HttpClient);
  private tokenService: TokenService = inject(TokenService);

  constructor() {}

  login(credentials: ILogin) {
    return this.http
      .post<ILoginResponse>(apiEndpoint.AUTH_LOCAL.LOGIN, credentials)
      .pipe(
        map((response) => {
          if (response) {
            this.tokenService.setToken(response.access_token);
          }
          return response;
        })
      );
  }

  logout() {
  }
}
