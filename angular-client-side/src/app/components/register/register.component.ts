import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '@models/user';
import ConfirmedValidator from '@src/app/confirmed.validator';
import { RouterLink } from '@angular/router';
import { SharedFormGroupComponent } from '../shared-form-group/shared-form-group.component';
import {NgClass, NgOptimizedImage} from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    imports: [
        MatCardModule,
        NgClass,
        SharedFormGroupComponent,
        RouterLink,
        NgOptimizedImage
    ]
})
export class RegisterComponent implements OnInit {
  title: string = 'Register your account';
  formFields: any = User.registerFields();
  authForm: FormGroup = new FormGroup({
    nickname: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    new_password: new FormControl(''),
  });

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.authForm = this.formBuilder.group({
      nickname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      new_password: ['', Validators.required],
    },
    {
      validators: [ConfirmedValidator.match('password', 'new_password')]
    });
  }
}
