import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '@models/user';
import { Team } from '@models/team';
import { UserRestService } from '@services/user-rest/user-rest.service';
import { TeamRestService } from '@services/team-rest/team-rest.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgSwitch, NgSwitchCase, NgFor, NgClass, NgIf, NgSwitchDefault } from '@angular/common';

@Component({
    selector: 'app-shared-form-field',
    templateUrl: './shared-form-field.component.html',
    styleUrls: ['./shared-form-field.component.css'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgSwitch, NgSwitchCase, NgFor, MatFormFieldModule, NgClass, MatInputModule, MatIconModule, NgIf, NgSwitchDefault, MatButtonModule]
})
export class SharedFormFieldComponent implements OnInit {
  passwordFields: any = User.paswordfields();
  @Input() input!:any;
  @Input() value!:string;
  @Input() flag!:any;
  @Input() obj!:any;
  @Input() authForm!: FormGroup;
  hide = true;
  message!: string;

  constructor(public router: Router, 
    private restService: UserRestService, 
    private teamRestService: TeamRestService) {
  }
  
  ngOnInit(): void {
    this.populateForm();
  }

  populateForm() {
    //if a user already exists populates the formFields inputs.
    let values = Object.entries(this.obj);

    if(this.input.type == 'password') {
      let teste = this.authForm.get('pass');
      values.forEach((val:any) => {
        if(val[0] == this.input.name) {
          teste?.get(this.input.name)?.setValue(val[1]);
        }
      });
    }
    else {
      let teste = this.authForm.get(this.input.name);

      values.forEach((val:any) => {
        if(val[0] == this.input.name) {
          teste?.setValue(val[1]);
        }
      });
    }
  }

  getUser(): Observable<any> {
    return this.restService.getUser();
  }

  editUser(user: User): void {
    const editValues = {
      Password: user.password,
      Email: user.email,
    }
    this.restService.updateUser(editValues).subscribe({
      next: () => {
        this.getUser().subscribe((user) => {
          this.obj = user;
          this.populateForm();
        });
        //window.location.reload()
      },
      error: (err) => console.log(err)
    });
  }

  getTeam(): Observable<any> {
    return this.teamRestService.getTeam(this.obj.teamTag);
  }

  editTeam(team: Team): void {
    const editValues = {
      Name: team.name,
      Tag: team.tag
    } 
    this.teamRestService.updateTeam(editValues).subscribe({
      next: () => {
        this.getTeam().subscribe((team) => {
          this.obj = team;
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
    const data = this.obj!;
    if(this.input.type == 'password') {
      (data as any)[this.input.name!] = this.authForm.get('password')?.value
    }
    else {
      (data as any)[this.input.name!] = this.authForm.get(this.input.name)?.value
    }
    this.flag = "view";
    this.editObj(data);
  }

  editObj(data: any) {
    (this.router.url == "/view-my-team") ? this.editTeam(data) : this.editUser(data);
  }

  getErrorMessage(name: string) {
    if (this.authForm.get(name)?.hasError('required')) {
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

    return (this.authForm.get(name)?.hasError(name) || this.authForm.get(name)?.errors?.['matching']) ? this.message : '';
  }
}