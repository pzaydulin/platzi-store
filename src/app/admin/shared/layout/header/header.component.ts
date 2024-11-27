import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  protected isLoggedIn$;

  private authService: AuthService = inject(AuthService);

  constructor() {
    this.isLoggedIn$ = this.authService.isAuthenticated.pipe(
      takeUntilDestroyed()
    );
  }

  toggleMenu() {
    const collapseMenu = document.getElementById('collapseMenu');

    if (collapseMenu) {
      if (collapseMenu.style.display === 'block') {
        collapseMenu.style.display = 'none';
      } else {
        collapseMenu.style.display = 'block';
      }
    }
  }

  logOut() {
    this.authService.logout();
  }
}
