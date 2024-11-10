import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,  ReactiveFormsModule,  Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {

  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  protected destroy$ = new Subject();
  protected loginForm!: FormGroup;

  constructor(private fb:FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            if(res) {
              this.router.navigate(['products']);
            }
          }
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
