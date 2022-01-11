import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { User } from '@models/user';
import { ConfirmedValidator } from '@src/app/confirmed.validator';

@Component({
  selector: 'app-shared-form-field',
  templateUrl: './shared-form-field.component.html',
  styleUrls: ['./shared-form-field.component.css']
})
export class SharedFormFieldComponent implements OnInit {
  @Input() input!:any;
  @Input() type?:any;
  @Input() value!:string;
  @Input() formFields!:any;
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

    // this.nickname = this.authForm.get("nickname")?.value;
    // console.log(this.nickname);
    // this.password = this.authForm.get("password")?.value;
    // console.log(this.password);

    this.authService.login(this.authForm.get("nickname")?.value, this.authForm.get("current_password")?.value).subscribe({
      next: (result: any) => {
        localStorage.setItem('currentUser', result.token);
        this.router.navigate(['/']);
      },
      error: () => alert("Erro no login")
    });
  }

  register(): void{
    this.authService.register(this.authForm.get('email')?.value, this.authForm.get('nickname')?.value, 
    this.authForm.get('current_password')?.value).subscribe((user: User) => {
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.router.navigate(['/'])
      } else {
        alert('Erro a registar!');
      }
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