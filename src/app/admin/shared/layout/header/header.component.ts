import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TokenService } from '../../../core/services/token.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  protected isLoggedIn$;

  private tokenService: TokenService = inject(TokenService);
  private router: Router = inject(Router);

  constructor() {
    this.isLoggedIn$ = this.tokenService.isAuthenticated.pipe(takeUntilDestroyed());
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
    this.tokenService.removeToken();
    this.router.navigate(['']);
  }
}
