import { NgClass } from '@angular/common';
import {
  Component,
  effect,
  inject,
  input,
  type OnInit,
  signal,
  type WritableSignal,
} from '@angular/core';
import { type FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import type { Team } from '@models/team';
import { passwordFields, type User } from '@models/user';
import { TeamRestService } from '@services/team-rest/team-rest.service';
import { UserRestService } from '@services/user-rest/user-rest.service';
import type { FieldInput } from '@shared/utils';
import type { Observable } from 'rxjs';

@Component({
  selector: 'app-shared-form-field',
  templateUrl: './shared-form-field.component.html',
  styleUrls: ['./shared-form-field.component.css'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    NgClass,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class SharedFormFieldComponent implements OnInit {
  private router = inject(Router);
  private restService = inject(UserRestService);
  private teamRestService = inject(TeamRestService);

  passwordFields = passwordFields();
  readonly input = input.required<FieldInput>();
  readonly value = input.required<string>();
  inputUser = input.required<User | Team>();
  currentUser: WritableSignal<User | Team> = signal({} as User | Team);
  authForm = input.required<FormGroup>();
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
    const values = Object.entries(user) as [
      keyof (User | Team),
      User[keyof User] | Team[keyof Team],
    ][];

    const inputValue = this.input();
    if (inputValue.type === 'password') {
      const auth_password = this.authForm().get('pass');
      values.forEach((val) => {
        const inputVal = this.input();
        if (val[0] === inputVal.name) {
          auth_password?.get(inputVal.name)?.setValue(val[1]);
        }
      });
    } else {
      const auth_username = this.authForm().get(inputValue.name);

      values.forEach((val) => {
        if (val[0] === this.input().name) {
          auth_username?.setValue(val[1]);
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
    };
    this.restService.updateUser(editValues).subscribe({
      next: () => {
        this.getUser().subscribe((updatedUser) => {
          this.currentUser.set(updatedUser);
          this.populateForm();
        });
        //window.location.reload()
      },
      error: (err) => console.log(err),
    });
  }

  getTeam(): Observable<Team> {
    return this.teamRestService.getTeam((this.currentUser() as Team).tag);
  }

  editTeam(team: Team): void {
    const editValues = {
      Name: team.name,
      Tag: team.tag,
    };
    this.teamRestService.updateTeam(editValues).subscribe({
      next: () => {
        this.getTeam().subscribe((updatedTeam) => {
          this.currentUser.set(updatedTeam);
          this.populateForm();
          window.location.reload();
        });
      },
      error: (err) => console.log(err),
    });
  }

  /**
   * Submeter dados atualizados
   */
  onSubmit(): void {
    const data = this.currentUser();
    const inputValue = this.input();
    if (inputValue.type === 'password') {
      data[inputValue.name as keyof (Team | User)] = this.authForm().get('password')?.value;
    } else {
      data[inputValue.name as keyof (Team | User)] = this.authForm().get(inputValue.name)?.value;
    }
    this.editObj(data);
  }

  editObj<TData extends Team | User>(data: TData) {
    this.router.url === '/view-my-team' ? this.editTeam(data as Team) : this.editUser(data as User);
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

    return authForm.get(name)?.hasError(name) || authForm.get(name)?.errors?.['matching']
      ? this.message
      : '';
  }
}
