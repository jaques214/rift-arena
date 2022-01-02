import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { User } from '@models/user';
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @Input() nickname = '';
  @Input() password = '';
  hide = true;
  formFields: any = User.loginFields();
  title: string = 'Insert your account data';
  @Input() input!: any;

  constructor(public router: Router, private authService: AuthService) {}

  ngOnInit(): void {}

  login(): void {
    // validar se o user inseriu dados (verificar se model dos inputs é null (por enquanto é nickname/password mas
    // vai ser alterado
    //, e se validou, pode avançar, senao, lançar um alert a dizer que n inseriu))

    this.nickname = this.formFields.inputs[0]!.model;
    this.password = this.formFields.inputs[1]!.model;

    this.authService.login(this.nickname, this.password).subscribe(
      (result: any) => {
        localStorage.setItem('currentUser', result.token);
        this.router.navigate(['/']);
      },
      (err: any) => {
        alert('erro no login');
      }
    );
  }
}
