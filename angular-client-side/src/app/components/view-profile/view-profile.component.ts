import { TeamRestService } from './../../services/team-rest/team-rest.service';
import { Observable } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { UserRestService } from '@services/user-rest/user-rest.service';
import {User} from '@models/user'
import { LinkedAccount } from '@models/linked_acount';
import { ActivatedRoute, Router } from '@angular/router';
import { Team } from '@models/team';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {
  @Input() input!: any;
  @Input() username = '';
  @Input() rank = '';
  @Input() region = '';
  user?: User;
  team?: Team;
  account?: LinkedAccount;
  info: any;
  icon?: string;
  label?: string;
  fileSelected?: File;
  image = (this.user?.profileImage as unknown as string);
  imageFieldName: string = this.normalizeImageName(this.image);
  imageFieldPath = 'https://localhost:5001/api/' + this.image;
  flag : string = "view";
  accountFlag: string = "view";
  formFields: any = User.fields();
  accountFields: any = LinkedAccount.fields();

  constructor(private restService : UserRestService, private teamRestService : TeamRestService, private route: ActivatedRoute, private router: Router) {
    const routeState = this.router?.getCurrentNavigation()?.extras?.state
    if (routeState) {
      this.user = routeState['user'];
      this.populateForm()
    }
   }

   ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
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
            rank: this.account.rank,
            region: this.account.region,
          };
        }
        console.log(this.info);
        console.log(this.account);
        this.getTeam(1).subscribe((team) => {
          this.team = team;
        });
      });
  }

   populateForm(){
    //if a user already exists populates the formFields inputs.
    this.formFields.inputs.forEach((input:any) => {
      input.model! = (this.user as any)[input.name!];
    });
  }

  clickEvent() {
      this.flag = (this.flag == "view") ? "edit" : "view";
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
      error: error => {
        // TODO: have error handling 
      }
    });
  }

  getUser(): Observable<any> {
    return this.restService.getUser();
  }

  getUserValue(value: any) {
    let convert: string = "";
    
    if(this.user != null) {
        let values = Object.entries(this.user!);

        values.forEach(val => {
          if(val[0] == value) {
            convert = val[1];
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

  getTeam(teamId: number): Observable<any> {
    return this.teamRestService.getTeam(teamId);
  }

  getTeamName() {
    return (this.user?.teamTag) ? this.user?.teamTag : "No Team";
  }

  onSubmit(): void {
    const data = this.user!;
    this.formFields.inputs.forEach((input:any) => {
      (data as any)[input.name!] = input.model;
    });
    this.flag = "view";
    this.editUser(data);
  }

  onSubmitAccount(): void {
    const data = this.account! || new LinkedAccount();
    this.accountFields.inputs.forEach((input:any) => {
      (data as any)[input.name!] = input.model;
    });
    this.accountFlag = "view";
    // if(this.accountFlag = "view") {
    //   this.icon = "add_circle_outline";
    //   this.label = "add circle outline icon";
    //   this.accountFlag = "edit";
    // }
    // else {
    //   this.accountFlag = "view";
    // }
    this.addAccount(data);
  }

  addAccount(account: LinkedAccount): void {
    this.username = this.accountFields.inputs[0]!.model;
    console.log("Username", this.username);
    this.region = this.accountFields.inputs[1]!.model;
    this.rank = this.accountFields.inputs[2]!.model;

    this.restService.addAccount(this.username, this.rank, this.region).subscribe(() => {
     /* if(this.account == undefined) {
        this.info = "No Linked Account";
      }
      else {
        this.info = this.user?.linkedAccount;
        console.log(this.info);
      }*/
      //this.user.linkedAccount = this.info.username;
      window.location.reload();
  });
  }

}