import { Component, Input, OnInit } from '@angular/core';
import { User } from '@models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  title: string = 'Register your account';
  formFields: any = User.registerFields();

  constructor() { }

  ngOnInit(): void {
  }
}
