import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@src/app/services/auth/auth.service';

@Component({
  selector: 'app-shared-form-group',
  templateUrl: './shared-form-group.component.html',
  styleUrls: ['./shared-form-group.component.css']
})
export class SharedFormGroupComponent implements OnInit {
  @Input() input!:any;
  @Input() type?:any;
  @Input() value!:string;
  @Input() formFields!:any;
  @Input() submitMethod: any;
  @Output() valueOnChange = new EventEmitter<string>();
  @Output() authMethod = new EventEmitter<string>();
  hide = true;
  listValues: string[] = [];
  selected: string = this.listValues[0];
  authForm!: FormGroup;
  message!: string;
  
  constructor(public router: Router, private authService: AuthService) {
  }
  
  ngOnInit(): void {
    console.log(this.formFields);
    this.authForm = new FormGroup({
      nickname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      current_password: new FormControl('', [Validators.required]),
      new_password: new FormControl('', [Validators.required]),
    }
      // validator: ConfirmedValidator('current_password', 'new_password')
    
    );
    // this.type || (this.type = this.formFields.type);
  }
  
  fieldOnChange(selected: string){
    this.valueOnChange.emit(selected);
  }

  submit() {
    console.log(this.router.url);
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

    this.authService.login(this.authForm.get("nickname")?.value, this.authForm.get("current_password")?.value).subscribe({
      next: (result: any) => {
        localStorage.setItem('currentUser', result.token);
        this.router.navigate(['/']);
      },
      error: () => console.log("Erro no login")
    });
  }

  register(): void{
    this.authService.register(this.authForm.get('email')?.value, this.authForm.get('nickname')?.value, 
    this.authForm.get('current_password')?.value).subscribe({
      next: (result: any) => {
        localStorage.setItem('currentUser', result.token);
        this.router.navigate(['/'])
    },
    error: () => console.log("Erro no registo")
    });
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
      case 'current_password':
        this.message = 'Not a valid password';
      break;
      case 'new_password':
        this.message = 'The password does not match';
      break;
    }

    return this.authForm.get(name)?.hasError(name) ? this.message : '';
  }
}