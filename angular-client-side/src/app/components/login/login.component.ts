import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import {User} from '@models/user'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  formFields:any = User.fields();
  title: string = 'Insert your account data';
  @Input() input!:any;
  
  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  /*login(): void {
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
    this.authService.register(this.username, this.password).subscribe((user: User) => {
      if (user && user.token) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.reload();
      } else {
        alert('Erro no login!');
      }
    });
  }*/

}
