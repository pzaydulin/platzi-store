import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { constants } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private storage: LocalStorageService = inject(LocalStorageService);
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() {}

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
