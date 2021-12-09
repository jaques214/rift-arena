import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import {User} from '@models/user'
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input() username = '';
  @Input() password = '';
  @Input() email = '';
  title: string = 'Register your account';
  formFields:any = User.registerFields();

  constructor(public router: Router, private authService: AuthService) { }

  ngOnInit(): void {
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
