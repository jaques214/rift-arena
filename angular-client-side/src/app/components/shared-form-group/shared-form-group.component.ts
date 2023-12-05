import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgFor, NgSwitch, NgSwitchCase, NgClass, NgIf, NgSwitchDefault } from '@angular/common';

@Component({
    selector: 'app-shared-form-group',
    templateUrl: './shared-form-group.component.html',
    styleUrls: ['./shared-form-group.component.css'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgFor, NgSwitch, NgSwitchCase, MatFormFieldModule, NgClass, MatInputModule, MatIconModule, NgIf, NgSwitchDefault, MatButtonModule]
})
export class SharedFormGroupComponent implements OnInit {
  @Input() formFields!:any;
  @Input() value!:string;
  @Input() authForm!:FormGroup;
  hide = true;
  // authForm: FormGroup = new FormGroup({
  //   nickname: new FormControl(''),
  //   email: new FormControl(''),
  //   password: new FormControl(''),
  //   new_password: new FormControl(''),
  // });
  message!: string;

  constructor(public router: Router, private authService: AuthService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
  }

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
    //, e se validou, pode avançar, senao, lançar um alert a dizer que n inseriu))

    this.authService.login(this.authForm.get("nickname")?.value, this.authForm.get("password")?.value).subscribe({
      next: (result: any) => {
        localStorage.setItem('currentUser', result.token);
        this.router.navigate(['/']);
      },
      error: () => console.log("Erro no login")
    });
  }

  register(): void{
    this.authService.register(this.authForm.get('email')?.value, this.authForm.get('nickname')?.value,
    this.authForm.get('password')?.value).subscribe({
      next: (result: any) => {
        localStorage.setItem('currentUser', result.token);
        this.router.navigate(['/'])
      },
      error: () => console.log("Erro no registo")
    });
  }

  getAutoCompleteValue(name: string):string {
    return (name == "password") ? "current_password" : "new_password";
  }

  getValidationResult(): boolean {
    return (this.router.url == "/register") ? this.authForm.invalid : false;
  }

  getErrorMessage(name: string) {
    if (this.authForm.get(name)?.hasError('required')) {
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

    return (this.authForm.get(name)?.hasError(name) || this.authForm.get(name)?.errors?.['matching']) ? this.message : '';
  }
}
