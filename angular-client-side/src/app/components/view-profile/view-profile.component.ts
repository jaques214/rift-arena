import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { User } from '@models/user'
import { LinkedAccount } from '@models/linked_acount';
import { Team } from '@models/team';
import { UserRestService } from '@services/user-rest/user-rest.service';
import ConfirmedValidator from '@src/app/confirmed.validator';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {
  response!: {dbPath: ''};
  user?: User;
  team?: Team;
  account?: LinkedAccount;
  info: any;
  icon?: string;
  flag : string = "view";
  accountFlag: string = "view";
  formFields: any = User.fields();
  passwordFields: any = User.paswordfields();
  accountFields: any = LinkedAccount.fields();
  hide = true;
  message!: string;
  filename!: string[];
  file: string = "";
  title!: string;
  form!: FormGroup;

  constructor(private restService : UserRestService) {
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
    console.log(this.formFields); 
    this.getUser().subscribe((user) => {
      this.user = user;      
      this.account = this.user?.linkedAccount;

      if(this.account == undefined) {
        this.info = "No Linked Account";
        this.icon = "add_circle_outline";
      }
      else {
        this.info = {
          username: this.account.username,
          region: this.account.region,
          rank: this.account.rank,
          summonerLevel: this.account.summonerLevel,
        };
      }
    });
  }

  editUser() {
    return this.restService.updateUser(this.file);
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

  public uploadFinished = (event: any) => {
    this.response = event;
    //console.log(this.response);
    (this.user!.poster as any) = this.response.dbPath;
    this.filename = (this.user?.poster! as string).split('\\');
    //console.log(this.filename);
    this.file = this.filename[2];
  }

  getFileName(): string {
    return (this.filename != undefined) ? this.filename[2] : "No file uploaded yet. Image in JPEG, PNG or GIF format and less than 10MB"; 
  }

  public createImgPath = (serverPath: string) => {
    console.log(serverPath);
    return `https://localhost:5001/${serverPath}`;
  }

  // getErrorMessage(name: string) {
  //   if (this.authForm.get(name)?.hasError('required')) {
  //     return 'You must enter a value';
  //   }

  //   // console.log(name);
  //   switch (name) {
  //     case 'nickname':
  //       this.message = "The nickname can't have any accents";
  //     break;
  //     case 'email':
  //       this.message = 'Not a valid email';
  //     break;
  //     case 'password':
  //       this.message = 'Not a valid password';
  //     break;
  //     case 'new_password':
  //       this.message = 'The password does not match';
  //     break;
  //   }

  //   return this.authForm.get(name)?.hasError(name) ? this.message : '';
  // }

  changeFlag(name: string): string {
    switch(name) {
      case 'email':
        this.flag = 'edit-' + name;
        break;
      case 'password':
        this.flag = 'edit-' + name;
        break;
    }
    //console.log(this.flag);
    return this.flag;
  }

  clickEvent(name: string) {
    this.flag = (this.flag == "view") ? this.changeFlag(name) : "view";
    //console.log(this.flag);
  }

  clickAccount() {
    this.accountFlag = (this.accountFlag == "view") ? "edit" : "view";
  }

  getUser(): Observable<any> {
    return this.restService.getUser();
  }

  hideText(index: number, str: string): string {
    let convert: string = "";
    const tam = str.length;
    while(index < tam) {
      convert += '*';
      index++;
    }
    return convert;
  }

  selectValue(key: string, value: string): string {
    let convert: string;
    let i = 0;
    switch(key) {
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

  getUserValue(value: any): string {
    let convert: string = "";
    
    if(this.user != null) {
      let values = Object.entries(this.user!);
      //console.log(values);
      values.forEach(val => {
        if(val[0] == value) {
          convert = this.selectValue(value, val[1]);         
        }
      });
    }
    return convert;
  }

  // getTeam(): Observable<any> {
  //   return this.teamRestService.getTeam();
  // }

  getTeamName() {
    return (this.user?.teamTag) ? this.user?.teamTag : "No Team";
  }
}