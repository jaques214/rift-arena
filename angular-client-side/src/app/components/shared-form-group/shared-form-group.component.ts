import { NgClass } from '@angular/common';
import { Component, inject, input, type OnInit } from '@angular/core';
import { type FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import type { FieldInput } from '@src/app/shared/utils';

@Component({
  selector: 'app-shared-form-group',
  templateUrl: './shared-form-group.component.html',
  styleUrls: ['./shared-form-group.component.css'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    NgClass,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class SharedFormGroupComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  readonly formFields = input.required<FieldInput[]>();
  readonly value = input.required<string>();
  readonly authForm = input.required<FormGroup>();
  hide = true;
  // authForm: FormGroup = new FormGroup({
  //   nickname: new FormControl(''),
  //   email: new FormControl(''),
  //   password: new FormControl(''),
  //   new_password: new FormControl(''),
  // });
  message!: string;

  ngOnInit(): void {}

  submit() {
    switch (this.router.url) {
      case '/login':
        this.login();
        break;
      default:
        this.register();
        break;
    }
  }

  login(): void {
    // validar se o user inseriu dados (verificar se model dos inputs é null (por enquanto é nickname/password mas
    // vai ser alterado
    //, e se validou, pode avançar, senão, lançar um alert a dizer que não inseriu))

    const authForm = this.authForm();
    this.authService
      .login(authForm.get('nickname')?.value, authForm.get('password')?.value)
      .subscribe({
        next: async (result) => {
          const token = result.token;
          const nickname = this.authForm().get('nickname')?.value;
          console.log('Token recebido:', token);
          console.log('Nickname recebido:', nickname);
          if (!token) {
            console.log('Erro no login: token não recebido');
            return;
          }

          localStorage.setItem('currentUser', token);
          this.authService.setCurrentUser(nickname);
          await this.router.navigate(['/']);
        },
        error: () => console.log('Erro no login'),
      });
  }

  register(): void {
    const authForm = this.authForm();
    this.authService
      .register(
        authForm.get('email')?.value,
        authForm.get('nickname')?.value,
        authForm.get('password')?.value,
      )
      .subscribe({
        next: (result) => {
          const token = result.token;
          const nickname = this.authForm().get('nickname')?.value;
          if (!token) {
            console.log('Erro no registo: token não recebido');
            return;
          }

          localStorage.setItem('currentUser', token);
          this.authService.setCurrentUser(nickname);
          this.router.navigate(['/']);
        },
        error: () => console.log('Erro no registo'),
      });
  }

  getAutoCompleteValue(name: string): string {
    return name === 'password' ? 'current-password' : 'new-password';
  }

  getValidationResult(): boolean {
    return this.router.url === '/register' ? this.authForm().invalid : false;
  }

  getErrorMessage(name: string) {
    const authForm = this.authForm();
    if (authForm.get(name)?.hasError('required')) {
      return 'You must enter a value';
    }

    switch (name) {
      case 'nickname':
        this.message = "The nickname can't have any accents";
        break;
      case 'email':
        this.message = 'Not a valid email';
        break;
      case 'password':
        this.message = 'Not a valid password';
        break;
      case 'new_password':
        this.message = 'Password and Confirm Password must be match.';
        break;
    }

    return authForm.get(name)?.hasError(name) || authForm.get(name)?.errors?.['matching']
      ? this.message
      : '';
  }
}
