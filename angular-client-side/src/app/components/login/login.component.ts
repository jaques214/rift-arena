import { Component, OnInit } from '@angular/core';
import { User } from '@models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  formFields: any = User.loginFields();
  title: string = 'Insert your account data';

  constructor() {}

  ngOnInit(): void {
  }
}
