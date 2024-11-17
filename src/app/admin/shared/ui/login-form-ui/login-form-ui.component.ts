import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login-form-ui',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, PasswordModule],
  templateUrl: './login-form-ui.component.html',
  styleUrl: './login-form-ui.component.scss',
})
export class LoginFormUiComponent implements OnInit {

  @Output() credentals = new EventEmitter()

  protected loginForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.credentals.emit(this.loginForm.value);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}