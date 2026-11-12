import { NgClass, NgOptimizedImage } from '@angular/common';
import { Component, inject, type OnInit, signal, type WritableSignal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { AccountFormGroupComponent } from '@components/account-form-group/account-form-group.component';
import { NavBarComponent } from '@components/nav-bar/nav-bar.component';
import { SharedFormFieldComponent } from '@components/shared-form-field/shared-form-field.component';
import { UploadComponent, type UploadResponse } from '@components/upload/upload.component';
import { accountFields, type LinkedAccount } from '@models/linked_acount';
import type { Team } from '@models/team';
import { type User, userFields } from '@models/user';
import { UserRestService } from '@services/user-rest/user-rest.service';
import { match } from '@src/app/confirmed.validator';
import { environment } from '@src/environments/environment';

type Info = {
  username?: string;
  region?: string;
  rank?: string;
  summonerLevel?: number;
};

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css'],
  imports: [
    NavBarComponent,
    NgClass,
    MatIconModule,
    MatFormFieldModule,
    UploadComponent,
    SharedFormFieldComponent,
    AccountFormGroupComponent,
    MatButtonModule,
    NgOptimizedImage,
  ],
})
export class ViewProfileComponent implements OnInit {
  private restService = inject(UserRestService);

  response!: UploadResponse;
  team?: Team;
  account: LinkedAccount | null = null;
  //info!: Info | string = "No Linked Account";
  icon?: string;
  flag: string = 'view';
  accountFlag: string = 'view';
  formFields = userFields();
  accountFields = accountFields();
  message!: string;
  filename!: string[];
  file: string = '';
  title!: string;
  form!: FormGroup;

  user: WritableSignal<User> = signal({ teamTag: null });

  constructor() {
    this.restService.getUser().subscribe({
      next: (user) => {
        this.user.set(user);
        this.account = user.linkedAccount ?? null;
        this.icon = user.linkedAccount ? 'edit' : 'add_circle_outline';
      },
      error: (error) => console.error('Failed to load user profile', error),
    });
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      pass: new FormGroup(
        {
          password: new FormControl('', [Validators.required]),
          new_password: new FormControl('', [Validators.required]),
        },
        {
          validators: [match('password', 'new_password')],
        },
      ),
    });
  }

  unlinkRiotAccount(): void {
    this.restService.unlinkAccount().subscribe({
      next: () => window.location.reload(),
      error: (err) => console.log(err),
    });
  }

  changeTitle(poster: string | undefined): string {
    return poster ? 'Change profile image' : 'Insert profile image';
  }

  typeOf(info: string | Info) {
    if (typeof info === 'string') {
      return 'No Linked Account';
    }
    return {
      username: this.account?.username,
      region: this.account?.region,
      rank: this.account?.rank,
      summonerLevel: this.account?.summonerLevel,
    };
  }

  public uploadFinished = (event: UploadResponse) => {
    this.response = event;
    const currentUser = this.user();
    currentUser.poster = this.response.dbPath;
    this.user.set(currentUser);
    this.file = this.user().poster ?? '';
  };

  getFileName(): string {
    return this.filename !== undefined
      ? this.filename[2]
      : 'No file uploaded yet. Image in JPEG, PNG or GIF format and less than 10MB';
  }

  public createImgPath = (serverPath: string) => {
    return `${environment.apiUrl}/Resources/Images/${serverPath}`;
  };

  changeFlag(name: string): string {
    switch (name) {
      case 'email':
        this.flag = `edit-${name}`;
        break;
      case 'password':
        this.flag = `edit-${name}`;
        break;
    }
    return this.flag;
  }

  clickEvent(name: string) {
    this.flag = this.flag === 'view' ? this.changeFlag(name) : 'view';
  }

  clickAccount() {
    this.accountFlag = this.accountFlag === 'view' ? 'edit' : 'view';
  }

  hideText(index: number, str: string): string {
    let convert: string = '';
    const tam = str.length;
    while (index < tam) {
      convert += '*';
      index++;
    }
    return convert;
  }

  selectValue(key: string, value: string): string {
    let convert: string;
    const i = 0;
    switch (key) {
      case 'email': {
        const part = value.split('@');
        const teste = part[0].slice(1, part[0].length - 2);
        convert = `${part[0].slice(0, 1)}${this.hideText(i, teste)}${part[0].slice(part[0].length - 1)}@${part[1]}`;
        break;
      }
      case 'password':
        convert = this.hideText(i, value);
        break;
      default:
        convert = value;
        break;
    }
    return convert;
  }

  getUserValue(value: string): string {
    const currentUser = this.user();
    return currentUser[value as keyof User]
      ? this.selectValue(value, currentUser[value as keyof User] as string)
      : '';
  }

  removeUser() {
    this.restService.removeProfile().subscribe({
      next: () => window.location.reload(),
      error: (err) => console.log(err),
    });
  }

  getTeamName() {
    const currentUser = this.user();
    return currentUser?.teamTag ? currentUser?.teamTag : 'No Team';
  }
}
