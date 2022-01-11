import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { User } from '@models/user';
import { AuthService } from '@services/auth/auth.service';
import { FormControl, FormGroup } from '@angular/forms';

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
  hide = true;
  // authForm!: FormGroup;
  // @Input() type?:any;

  constructor(public router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    //this.type || (this.type = this.formFields.type);
    // this.authForm = new FormGroup({
    //   nickname: new FormControl(''),
    //   email: new FormControl(''),
    //   password: new FormControl(''),
    // });
  }

  // register(): void{
  //   this.authService.register(this.email, this.nickname, this.password).subscribe((user: User) => {
  //     if (user) {
  //       localStorage.setItem('currentUser', JSON.stringify(user));
  //       this.router.navigate(['/'])
  //     } else {
  //       alert('Erro a registar!');
  //     }
  //   });
  // }

}