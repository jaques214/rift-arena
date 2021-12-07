import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import {User} from '@models/user'
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() username = '';
  @Input() password = '';
  @Input() email = '';
  @Input() userLogin: User = new User();
  hide = true;
  formFields:any = User.loginFields();
  
  title: string = 'Insert your account data';
  @Input() input!:any;
  
  constructor(public router: Router, private authService: AuthService) { }

  ngOnInit(): void {}

  login(): void {
    this.authService.login(this.username, this.password).subscribe((user: User) => {
      if (user && user.token) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.reload();
      } else {
        alert('Erro no login!');
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
        localStorage.removeItem('currentUser');
        window.location.reload();
    });
  }

  register(): void{
    this.authService.register(this.email, this.username, this.password).subscribe((user: User) => {
      if (user && user.token) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.reload();
      } else {
        alert('Erro no login!');
      }
    });
  }

}
