import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { User } from '@models/user'
import { LinkedAccount } from '@models/linked_acount';
import { Team } from '@models/team';
import { UserRestService } from '@services/user-rest/user-rest.service';
import ConfirmedValidator from '@src/app/confirmed.validator';
import { environment } from '@src/environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { AccountFormGroupComponent } from '../account-form-group/account-form-group.component';
import { SharedFormFieldComponent } from '../shared-form-field/shared-form-field.component';
import { UploadComponent } from '../upload/upload.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {NgClass, NgIf, NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault, NgOptimizedImage} from '@angular/common';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

type FieldInput = {
      name: string,
      type: string,
      label: string,
      placeholder: string,
      iconlabel: string,
      icon: string,
}

type Field = {
  inputs: FieldInput[]
}

type Info = {
  username?: string,
  region?: string,
  rank?: string,
  summonerLevel?: number,
};

@Component({
    selector: 'app-view-profile',
    templateUrl: './view-profile.component.html',
    styleUrls: ['./view-profile.component.css'],
    standalone: true,
  imports: [NavBarComponent, NgClass, NgIf, MatIconModule, MatFormFieldModule, UploadComponent, NgFor, NgSwitch, NgSwitchCase, SharedFormFieldComponent, NgSwitchDefault, AccountFormGroupComponent, MatButtonModule, NgOptimizedImage]
})
export class ViewProfileComponent implements OnInit {
  response!: { dbPath: '' };
  user!: User;
  team?: Team;
  account?: LinkedAccount;
  //info!: Info | string = "No Linked Account";
  icon?: string;
  flag: string = "view";
  accountFlag: string = "view";
  formFields: Field = User.fields();
  accountFields = LinkedAccount.fields();
  message!: string;
  filename!: string[];
  file: string = "";
  title!: string;
  form!: FormGroup;

  constructor(private restService: UserRestService) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      pass: new FormGroup({
        password: new FormControl('', [Validators.required]),
        new_password: new FormControl('', [Validators.required]),
      },
        {
          validators: [ConfirmedValidator.match('password', 'new_password')]
        }
      )
    });
    this.getUser().subscribe((user) => {
      this.user = user;
      this.account = this.user?.linkedAccount;
      console.log(this.user)
      console.log(this.account)

      if (this.account == undefined) {
        //this.info = "No Linked Account";
        this.icon = "add_circle_outline";
      }
      else {
        this.icon = "edit";
          //this.typeOf(this.info)
      }
      //console.log(this.info)
    });
    console.log(this.accountFlag)
  }

  unlinkRiotAccount(): void {
    this.restService.unlinkAccount().subscribe({
      next: () => window.location.reload(),
      error: (err) => console.log(err)
    });
  }

  changeTitle() {
    return (this.user?.poster) ? 'Change profile image' : 'Insert profile image';
  }

  typeOf(info: string | Info) {
    if (typeof info === "string") {
      return "No Linked Account"
    }
      return {
        username: this.account?.username,
        region: this.account?.region,
        rank: this.account?.rank,
        summonerLevel: this.account?.summonerLevel,
      }
  }

  public uploadFinished = (event: any) => {
    this.response = event;
    (this.user!.poster as any) = this.response.dbPath;
    this.file = this.user?.poster!;
  }

  getFileName(): string {
    return (this.filename != undefined) ? this.filename[2] : "No file uploaded yet. Image in JPEG, PNG or GIF format and less than 10MB";
  }

  public createImgPath = (serverPath: string) => {
    return `${environment.apiUrl}/Resources/Images/${serverPath}`;
  }

  changeFlag(name: string): string {
    switch (name) {
      case 'email':
        this.flag = 'edit-' + name;
        break;
      case 'password':
        this.flag = 'edit-' + name;
        break;
    }
    return this.flag;
  }

  clickEvent(name: string) {
    this.flag = (this.flag == "view") ? this.changeFlag(name) : "view";
  }

  clickAccount() {
    this.accountFlag = (this.accountFlag == "view") ? "edit" : "view";
  }

  getUser(): Observable<User> {
    return this.restService.getUser();
  }

  hideText(index: number, str: string): string {
    let convert: string = "";
    const tam = str.length;
    while (index < tam) {
      convert += '*';
      index++;
    }
    return convert;
  }

  selectValue(key: string, value: string): string {
    let convert: string;
    let i = 0;
    switch (key) {
      case "email":
        let part = value.split('@');
        let teste = part[0].slice(1, part[0].length - 2);
        convert = part[0].slice(0, 1) + this.hideText(i, teste) + part[0].slice(part[0].length - 1) + '@' + part[1];
        break;
      case "password":
        convert = this.hideText(i, value);
        break;
      default:
        convert = value;
        break;
    }
    return convert;
  }

  getUserValue(value: string): string {
    let convert: string = "";

    if (this.user != null) {
      let values = Object.entries(this.user!);

      values.forEach(val => {
        if (val[0] == value) {
          convert = this.selectValue(value, val[1]);
        }
      });
    }
    return convert;
  }

  removeUser() {
    this.restService.removeProfile().subscribe({
      next: () => window.location.reload(),
      error: (err) => console.log(err)
    });
  }

  getTeamName() {
    return (this.user?.teamTag) ? this.user?.teamTag : "No Team";
  }
}
