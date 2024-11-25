import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { constants } from '../constants';
import { Store } from '@ngrx/store';
import { getAccessToken } from '../store/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private storage: LocalStorageService = inject(LocalStorageService);
  private storeNgRx$ = inject(Store);
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);
  accessToken?: string

  constructor() {
    this.storeNgRx$.select(getAccessToken)
      .subscribe(token => {
        this.accessToken = token
        console.log("token changed: ", token);
        
      });

    if(this.accessToken) {
      this.updateToken(true);
    }
  }

  getToken() {
    return this.storage.getItem(constants.TOKEN_KEY);
  }

  setToken(token: string) {
    this.storage.setItem(constants.TOKEN_KEY, token);
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
