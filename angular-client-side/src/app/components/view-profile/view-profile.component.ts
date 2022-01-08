import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { User } from '@models/user'
import { LinkedAccount } from '@models/linked_acount';
import { Team } from '@models/team';
import { UserRestService } from '@services/user-rest/user-rest.service';
import { TeamRestService } from '@services/team-rest/team-rest.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {
  username = '';
  rank = '';
  region = '';
  user?: User;
  team?: Team;
  account?: LinkedAccount;
  info: any;
  icon?: string;
  fileSelected?: File;
  image = (this.user?.profileImage as unknown as string);
  imageFieldName: string = this.normalizeImageName(this.image);
  imageFieldPath = 'https://localhost:5001/api/' + this.image;
  flag : string = "view";
  accountFlag: string = "view";
  formFields: any = User.fields();
  accountFields: any = LinkedAccount.fields();
  form!: FormGroup;

  constructor(private restService : UserRestService, private teamRestService : TeamRestService,
     private router: Router) {
    const routeState = this.router?.getCurrentNavigation()?.extras?.state
    if (routeState) {
      this.user = routeState['user'];
      this.populateForm()
    }
  }
   
  ngOnInit(): void {
    this.getUser().subscribe((user) => {
      this.user = user;
      this.account = this.user?.linkedAccount;
      this.populateForm();
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

  inputFieldOnChange(value: string): any {
    this.accountFields.inputs.forEach((input:any) => {
      if(input.type == 'select') {
        switch(input.value) {
          case 'rank':
            this.rank = value;
            break;
          case 'region':
            this.region = value;
            break;
        }
      }
    });
  }

  changeFlag(name: string): string {
    switch(name) {
      case 'email':
        this.flag = 'edit-' + name;
        break;
      case 'password':
        this.flag = 'edit-' + name;
        break;
    }
    console.log(this.flag);
    return this.flag;
  }

  populateForm() {
    //if a user already exists populates the formFields inputs.
    this.formFields.inputs.forEach((input:any) => {
      input.model! = (this.user as any)[input.name!];
    });
  }

  clickEvent(name: string) {
    this.flag = (this.flag == "view") ? this.changeFlag(name) : "view";
  }

  clickAccount() {
    this.accountFlag = (this.accountFlag == "view") ? "edit" : "view";
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

      values.forEach(val => {
        if(val[0] == value) {
          convert = this.selectValue(value, val[1]);         
        }
      });
    }
    return convert;
  }

  normalizeImageName(imagePath: string): string {
    return imagePath?.split('_')?.splice(2)?.join('_');
  }

  onFileSelected(user: any): void {
    const target: HTMLInputElement | null = user.target as HTMLInputElement;
    this.fileSelected = target?.files?.[0] as File;
  }

  // getTeam(): Observable<any> {
  //   return this.teamRestService.getTeam();
  // }

  getTeamName() {
    return (this.user?.teamTag) ? this.user?.teamTag : "No Team";
  }

  /**
   * Submeter dados atualizados do utilizador
   */
  onSubmit(): void {
    const data = this.user!;
    this.formFields.inputs.forEach((input:any) => {
      (data as any)[input.name!] = input.model;
    });
    this.flag = "view";
    this.editUser(data);
  }

  onSubmitAccount(): void {
    const data = new LinkedAccount();
    this.accountFields.inputs.forEach((input:any) => {
      if(input.type != 'select') {
        (data as any)[input.name!] = input.model;
      }
    });
    this.accountFlag = "view";
    this.addAccount(data);
  }

  addAccount(account: LinkedAccount): void {
    this.username = account.username!;

    this.restService.addAccount(this.username, this.region).subscribe({
      next: () => window.location.reload(),
      error: (err) => console.log(err)
    });
  }

}