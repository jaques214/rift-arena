import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LinkedAccount } from '@models/linked_acount';
import { UserRestService } from '@services/user-rest/user-rest.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgFor, NgSwitch, NgSwitchCase, NgClass, NgSwitchDefault, NgIf } from '@angular/common';

@Component({
    selector: 'app-account-form-group',
    templateUrl: './account-form-group.component.html',
    styleUrls: ['./account-form-group.component.css'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgFor, NgSwitch, NgSwitchCase, MatFormFieldModule, NgClass, MatSelectModule, MatOptionModule, MatIconModule, NgSwitchDefault, MatInputModule, NgIf, MatButtonModule]
})
export class AccountFormGroupComponent implements OnInit {
  @Input() value!:string;
  @Input() formFields!:any;
  @Input() accountFlag!:any;
  username = '';
  rank = '';
  region = '';
  form!: FormGroup;
  message!: string;

  constructor(public router: Router, private restService : UserRestService) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required]),
      region: new FormControl(null, [Validators.required]),
    });
  }

  onSubmitAccount(): void {
    const data = new LinkedAccount();

    this.formFields.forEach((input:any) => {
      if(input.type != 'select') {
        // (data as any)[input.name!] = input.model;
        (data as any)[input.name!] = this.form.get(input.name)?.value
      }
      else {
        this.region = this.form.get(input.value)?.value;
      }
    });
    this.accountFlag = "view";

    const values = Object.values(data);

    (values.includes(undefined)) ? this.addAccount(data) : this.editAccount(data);
  }

  addAccount(account: LinkedAccount): void {
    this.username = account.username!;

    this.restService.addAccount(this.username, this.region).subscribe({
      next: () => window.location.reload(),
      error: (err) => console.log(err)
    });
  }

  editAccount(account: LinkedAccount): void {
    this.username = account.username!;

    this.restService.updateRiotAccount(this.username, this.region).subscribe({
      next: () => window.location.reload(),
      error: (err) => console.log(err)
    });
  }

  getErrorMessage(name: string) {
    if (this.form.get(name)?.hasError('required')) {
      return 'You must enter a value';
    }

    switch (name) {
      case 'username':
        this.message = "Not a valid username";
      break;
      case 'region':
        this.message = "Region doesn't exist";
      break;
    }

    return this.form.get(name)?.hasError(name) ? this.message : '';
  }
}
