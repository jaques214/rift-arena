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
  user!: User;
  account!: LinkedAccount;
  account1 = {
    username: "n",
    rank: "g",
    region: "Portugal"
  }

  info: any;
  icon?: string;
  label?: string;
  fileSelected?: File;
  image = (this.user?.profileImage as unknown as string);
  imageFieldName: string = this.normalizeImageName(this.image);
  imageFieldPath = 'https://localhost:5001/api/' + this.image;
  flag : string = "view";
  @Input() input!: any;
  formFields: any = User.registerFields();
  propertyValues: any = []; 

  constructor(private restService : UserRestService, private teamRestService : TeamRestService, private route: ActivatedRoute, private router: Router) {
    const routeState = this.router?.getCurrentNavigation()?.extras?.state
    if (routeState) {
      this.user = routeState['user'];
      this.populateForm()
    }
   }

   populateForm(){
    //if a user already exists populates the formFields inputs.
    this.formFields.inputs.forEach((input:any) => {
      input.model! = (this.user as any)[input.name!];
    });
  }

   onSubmit(): void {
    const data = this.user;
    this.formFields.inputs.forEach((input:any) => {
      (data as any)[input.name!] = input.model;
    });
    this.flag = "view";
    this.editUser(data);
  }

  clickEvent() {
    this.flag =  (this.flag = "view") ? "edit" : "view";
  }

  editUser(user: User): void {
    this.restService.updateUser(user).subscribe({
      next: () => {
        this.getUser(user.userID!).subscribe((user) => {
          this.user = user;
          this.populateForm();
        });
      },
      error: error => {
        // TODO: have error handling 
      }
    });
  }

  getUser(userId: number): Observable<any> {
    return this.restService.getUser(userId);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if(id && !this.user){
      this.getUser(id).subscribe((user) => {
        this.user = user;
        this.populateForm();
        if(this.account == undefined) {
          this.info = "No Linked Account";
          this.icon = "add_circle_outline";
          this.label = "remove_circle_outline";
        }
        else {
          this.info = {
            username: this.account1.username,
            rank: this.account1.rank,
            region: this.account1.region
          }
          this.icon = "remove_circle_outline";
          this.label = "remove circle outline icon";
        }
        console.log(this.user);
        console.log(this.user.userID);
      });
    }
  }

  getUserValue(value: any) {
    let values = Object.entries(this.user);
    console.log(values);
    let convert: string = "";

    values.forEach(val => {
      if(val[0] == value) {
           convert = val[1];
      }
    });
    console.log(convert);
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

  addAccount(account: LinkedAccount): void {
     this.restService.addAccount(account).subscribe(() => {
      // if(account == undefined) {
      //   this.info = "No Linked Account";
      // }
      // this.info = {
      //   username: account.username,
      //   rank: account.rank,
      //   region: account.region
      // }
      //window.location.reload();
  });
  }

}
