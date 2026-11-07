import { NgClass, NgOptimizedImage } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { loginFields } from '@models/user';
import { SharedFormGroupComponent } from '../shared-form-group/shared-form-group.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [MatCardModule, NgClass, SharedFormGroupComponent, RouterLink, NgOptimizedImage],
})
export class LoginComponent implements OnInit {
  private formBuilder = inject(FormBuilder);

  formFields = loginFields();
  title: string = 'Insert your account data';
  authForm: FormGroup = new FormGroup({
    nickname: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    new_password: new FormControl(''),
  });

  ngOnInit(): void {
    this.authForm = this.formBuilder.group({
      nickname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
}
