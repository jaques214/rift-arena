import { Component, inject, input, model, type OnInit } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import type { LinkedAccount } from '@models/linked_acount';
import { UserRestService } from '@services/user-rest/user-rest.service';
import type { FieldInput } from "@shared/utils";

@Component({
    selector: 'app-account-form-group',
    templateUrl: './account-form-group.component.html',
    styleUrls: ['./account-form-group.component.css'],
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatOptionModule, MatIconModule, MatInputModule, MatButtonModule]
})
export class AccountFormGroupComponent implements OnInit {
  private restService = inject(UserRestService);

  value = input<string>('');
  formFields = input<FieldInput[]>([]);
  existingAccount = input<LinkedAccount | null>(null);
  accountFlag = model<string>('');
  username = '';
  rank = '';
  region = '';
  form!: FormGroup;
  message!: string;

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required]),
      region: new FormControl(null, [Validators.required]),
    });
  }

  onSubmitAccount(): void {
    const data: LinkedAccount = {};

    this.formFields().forEach((input) => {
      if (input.type !== 'select') {
        data[input.name as keyof LinkedAccount] = this.form.get(input.name)?.value;
      } else {
        this.region = this.form.get(input.value as string)?.value;
      }
    });

    const values = Object.values(data);
    const hasMissingValue = values.some((value) => value === undefined || value === null);

    if (hasMissingValue) {
      return;
    }

    this.accountFlag.set('view');

    const hasExistingAccount = !!this.existingAccount()?.username;
    (hasExistingAccount ? this.editAccount(data) : this.addAccount(data));
  }

  addAccount(account: LinkedAccount): void {
    this.username = account.username ?? "";

    this.restService.addAccount(this.username, this.region).subscribe({
      next: () => window.location.reload(),
      error: (err) => console.log(err)
    });
  }

  editAccount(account: LinkedAccount): void {
    this.username = account.username ?? "";

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
