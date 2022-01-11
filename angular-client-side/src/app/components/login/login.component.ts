import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { User } from '@models/user';
import { AuthService } from '@services/auth/auth.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  nickname: string = '';
  password: string = '';
  hide = true;
  formFields: any = User.loginFields();
  title: string = 'Insert your account data';
  authForm!: FormGroup;

  constructor(public router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // this.authForm = new FormGroup({
    //   nickname: new FormControl(''),
    //   email: new FormControl(''),
    //   password: new FormControl(''),
    // });
  }

  // login(): void {
  //   // validar se o user inseriu dados (verificar se model dos inputs é null (por enquanto é nickname/password mas
  //   // vai ser alterado
  //   //, e se validou, pode avançar, senao, lançar um alert a dizer que n inseriu))

  //   this.nickname = this.authForm.get("nickname")?.value;
  //   console.log(this.nickname);
  //   this.password = this.authForm.get("password")?.value;
  //   console.log(this.password);

  //   this.authService.login(this.nickname, this.password).subscribe({
  //     next: (result: any) => {
  //       localStorage.setItem('currentUser', result.token);
  //       this.router.navigate(['/']);
  //     },
  //     error: (err) => alert("Erro no login")
  //   });
  // }
}
