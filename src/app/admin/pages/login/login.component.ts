import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginFormUiComponent } from '../../shared/ui/login-form-ui/login-form-ui.component';
import { ILogin } from '../../core/models/auth.model';
import { Store } from '@ngrx/store';
import * as auth from '../../core/store/auth.selectors';
import { CommonModule } from '@angular/common';
import { AuthActions } from '../../core/store/auth.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    LoginFormUiComponent,
    ToastModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService],
})
export class LoginComponent implements OnInit {
  private store$ = inject(Store);
  protected loading$ = this.store$.select(auth.getLoading);
  protected serverError$ = this.store$.select(auth.getServerError);

  private messageService = inject(MessageService);
  private destroy$ = new Subject();
  private destroyRef = inject(DestroyRef);

  protected loginForm!: FormGroup;

  ngOnInit(): void {
    this.serverError$.pipe(takeUntil(this.destroy$)).subscribe((err) => {
      if (err) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `User Not Found (${err})`,
        });
      }
    });
  }

  onLogin(credentals: ILogin) {
    this.store$.dispatch(AuthActions.login(credentals));
  }

  private authService = inject(AuthService)
  getProfile() {
    this.authService.profile()
      .pipe(takeUntil(this.destroy$))
      .subscribe((profile) => {
        if (profile) {
          console.log('Profile:', profile);
        }
      });
  }
}
