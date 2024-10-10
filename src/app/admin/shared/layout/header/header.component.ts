import { CommonModule } from '@angular/common';
import { Component, ElementRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(private elementRef: ElementRef<HTMLElement>) {}

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
}
