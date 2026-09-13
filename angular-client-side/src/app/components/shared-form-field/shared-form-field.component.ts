import { Component, OnInit, inject, input, signal, WritableSignal, effect } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '@models/user';
import { type Team } from '@models/team';
import { UserRestService } from '@services/user-rest/user-rest.service';
import { TeamRestService } from '@services/team-rest/team-rest.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgClass } from '@angular/common';
import {FieldInput} from "@shared/utils";

@Component({
    selector: 'app-shared-form-field',
    templateUrl: './shared-form-field.component.html',
    styleUrls: ['./shared-form-field.component.css'],
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, NgClass, MatInputModule, MatIconModule, MatButtonModule]
})
export class SharedFormFieldComponent implements OnInit {
  private router = inject(Router);
  private restService = inject(UserRestService);
  private teamRestService = inject(TeamRestService);

  passwordFields = User.passwordFields();
  readonly input = input.required<FieldInput>();
  readonly value = input.required<string>();
  inputUser = input.required<User | Team>();
  currentUser: WritableSignal<User | Team> = signal({});
  readonly authForm = input.required<FormGroup>();
  hide = true;
  message!: string;

  constructor() {
    effect(() => {
      this.currentUser.set(this.inputUser());
    });
  }

  ngOnInit(): void {
    this.populateForm();
  }

  populateForm() {
    const user = this.currentUser();
    //if a user already exists populates the formFields inputs.
    let values = Object.entries(user);

    const inputValue = this.input();
    if(inputValue.type == 'password') {
      let teste = this.authForm().get('pass');
      values.forEach((val:[string, any]) => {
        const inputVal = this.input();
        if(val[0] == inputVal.name) {
          teste!.get(inputVal.name)?.setValue(val[1]);
        }
      });
    }
    else {
      let teste = this.authForm().get(inputValue.name);

      values.forEach((val:[string, any]) => {
        if(val[0] == this.input().name) {
          teste?.setValue(val[1]);
        }
      });
    }
  }

  getUser(): Observable<User> {
    return this.restService.getUser();
  }

  editUser(user: User): void {
    const editValues = {
      Password: user.password,
      Email: user.email,
    }
    this.restService.updateUser(editValues).subscribe({
      next: () => {
        this.getUser().subscribe((updatedUser) => {
          this.currentUser.set(updatedUser);
          this.populateForm();
        });
        //window.location.reload()
      },
      error: (err) => console.log(err)
    });
  }

  getTeam(): Observable<Team> {
    return this.teamRestService.getTeam((this.currentUser() as Team).tag!);
  }

  editTeam(team: Team): void {
    const editValues = {
      Name: team.name,
      Tag: team.tag
    }
    this.teamRestService.updateTeam(editValues).subscribe({
      next: () => {
        this.getTeam().subscribe((updatedTeam) => {
          this.currentUser.set(updatedTeam);
          this.populateForm();
          window.location.reload();
        });
      },
      error: (err) => console.log(err)
    });
  }

  /**
   * Submeter dados atualizados
   */
   onSubmit(): void {
    const data = this.currentUser();
    const inputValue = this.input();
    if(inputValue.type == 'password') {
      (data as any)[inputValue.name!] = this.authForm().get('password')?.value
    }
    else {
      (data as any)[inputValue.name!] = this.authForm().get(inputValue.name)?.value
    }
    this.editObj(data);
  }

  editObj(data: any) {
    (this.router.url == "/view-my-team") ? this.editTeam(data) : this.editUser(data);
  }

  getErrorMessage(name: string) {
    const authForm = this.authForm();
    if (authForm.get(name)?.hasError('required')) {
      return 'You must enter a value';
    }

    switch (name) {
      case 'email':
        this.message = 'Not a valid email';
      break;
      case 'password':
        this.message = 'Not a valid password';
      break;
      case 'new_password':
         this.message = 'Password and Confirm Password must be match.';
      break;
    }

    return (authForm.get(name)?.hasError(name) || authForm.get(name)?.errors?.['matching']) ? this.message : '';
  }
}
