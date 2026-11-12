import { NgClass, NgOptimizedImage } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { registerFields } from '@models/user';
import { match } from '@src/app/confirmed.validator';
import { SharedFormGroupComponent } from '../shared-form-group/shared-form-group.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [MatCardModule, NgClass, SharedFormGroupComponent, RouterLink, NgOptimizedImage],
})
export class RegisterComponent implements OnInit {
  private formBuilder = inject(FormBuilder);

  title: string = 'Register your account';
  formFields = registerFields();
  authForm: FormGroup = new FormGroup({
    nickname: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    new_password: new FormControl(''),
  });

  ngOnInit(): void {
    this.authForm = this.formBuilder.group(
      {
        nickname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        new_password: ['', Validators.required],
      },
      {
        validators: [match('password', 'new_password')],
      },
    );
  }
}
