import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { constants } from '../constants';
import { Store } from '@ngrx/store';
import { getAccessToken, getAuthData } from '../store/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private storage: LocalStorageService = inject(LocalStorageService);
  private storeNgRx$ = inject(Store);
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);
  accessToken?: string;

  constructor() {
    this.storeNgRx$.select(getAccessToken).subscribe((token) => {
      this.accessToken = token;
      console.log('token changed: ', token);
      this.updateToken(!!token);
    });
  }

  getToken() {
    const authData = this.storage.getItem(constants.TOKEN_KEY);
    if (authData) {
      let obj = JSON.parse(authData);
      return obj.accessToken ?? '';
    }
    return '';
  }

  setToken(authDataString: string) {
    this.storage.setItem(constants.TOKEN_KEY, authDataString);
    this.updateToken(true);
  }

  updateToken(status: boolean) {
    this.isAuthenticated.next(status);
  }

  removeToken() {
    this.storage.removeItem(constants.TOKEN_KEY);
    this.updateToken(false);
  }
}
