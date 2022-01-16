import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmedValidator } from '@app/confirmed.validator';
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'app-shared-form-group',
  templateUrl: './shared-form-group.component.html',
  styleUrls: ['./shared-form-group.component.css']
})
export class SharedFormGroupComponent implements OnInit {
  @Input() formFields!:any;
  @Input() value!:string;
  hide = true;
  authForm!: FormGroup;
  message!: string;
  
  constructor(public router: Router, private authService: AuthService) {
  }
  
  ngOnInit(): void {
    //console.log(this.formFields);
    this.authForm = new FormGroup({
      nickname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      new_password: new FormControl('', [Validators.required, ConfirmedValidator('password', 'new_password')]),
    }
    )
  }

  submit() {
    //console.log(this.router.url);
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

  getErrorMessage(name: string) {
    if (this.authForm.get(name)?.hasError('required')) {
      return 'You must enter a value';
    }

    // console.log(name);
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

    return (this.authForm.get(name)?.hasError(name) || this.authForm.get(name)?.errors?.['confirmedValidator']) ? this.message : '';
  }
}