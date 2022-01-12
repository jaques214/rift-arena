import { UserRestService } from '@services/user-rest/user-rest.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { ConfirmedValidator } from '@src/app/confirmed.validator';
import { User } from '@models/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-shared-form-field',
  templateUrl: './shared-form-field.component.html',
  styleUrls: ['./shared-form-field.component.css']
})
export class SharedFormFieldComponent implements OnInit {
  @Input() input!:any;
  @Input() value!:string;
  @Input() flag!:any;
  // @Input() formFields!:any;
  @Input() submitMethod: any;
  user!:User;
  hide = true;
  authForm!: FormGroup;
  message!: string;

  constructor(public router: Router, private authService: AuthService, private restService: UserRestService) {
  }
  
  ngOnInit(): void {
    // console.log(this.formFields);
    this.authForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    }
    // validator: ConfirmedValidator('current_password', 'new_password')
    
    );
    this.getUser().subscribe((user) => {
      this.user = user;
      this.populateForm();
    });
  }

  populateForm() {
    let values = Object.entries(this.user);
    //console.log(values);
    //if a user already exists populates the formFields inputs.
      
      let teste = this.authForm.get(this.input.name);
      values.forEach((val:any) => {
        if(val[0] == this.input.name) {
          teste!.setValue(val[1]);
        }

      // this.form.get(input.name).setValue('');
      // input.model! = (this.user as any)[input.name!];
    });
  }

  getUser(): Observable<any> {
    return this.restService.getUser();
  }

  editUser(user: User): void {
    this.restService.updateUser(user.password!, user.email!).subscribe({
      next: () => {
        this.getUser().subscribe((user) => {
          this.user = user;
          this.populateForm();
        });
      },
      error: (err) => console.log(err)
    });
  }

  /**
   * Submeter dados atualizados do utilizador
   */
   onSubmit(): void {
    const data = this.user!;
    (data as any)[this.input.name!] = this.authForm.get(this.input.name)?.value
    //console.log(data);
    this.flag = "view";
    console.log(this.flag);
    this.editUser(data);
  }

  getErrorMessage(name: string) {
    if (this.authForm.get(name)?.hasError('required')) {
      return 'You must enter a value';
    }

    // console.log(name);
    switch (name) {
      case 'email':
        this.message = 'Not a valid email';
      break;
      case 'password':
        this.message = 'Not a valid password';
      break;
    }

    return this.authForm.get(name)?.hasError(name) ? this.message : '';
  }
}