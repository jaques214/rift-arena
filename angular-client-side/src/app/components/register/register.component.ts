import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { User } from '@models/user';
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  nickname: string = '';
  password: string = '';
  email: string = '';
  user?: User;
  title: string = 'Register your account';
  formFields: any = User.registerFields();

  constructor(public router: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }

  register(): void{
    this.nickname = this.formFields.inputs[0]!.model;
    this.email = this.formFields.inputs[1]!.model;
    this.password = this.formFields.inputs[2]!.model;

    this.authService.register(this.email, this.nickname, this.password).subscribe((user: User) => {
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.router.navigate(['/'])
      } else {
        alert('Erro a registar!');
      }
    });
  }

}