import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private authService: AuthService = inject(AuthService)

  constructor() {}

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
    this.authService.isAuthUpdate(true);
  }

  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
    this.authService.isAuthUpdate(false);
  }

  clear(): void {
    localStorage.clear();
    this.authService.isAuthUpdate(false);
  }
}
