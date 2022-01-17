import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TeamRestService } from '@services/team-rest/team-rest.service';
import { UserRestService } from '@services/user-rest/user-rest.service';
import { Component, OnInit } from '@angular/core';
import { Team } from '@models/team';
import { User } from '@models/user';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LinkedList } from 'linked-list-typescript';
import ConfirmedValidator from '@src/app/confirmed.validator';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-view-team',
  templateUrl: './view-team.component.html',
  styleUrls: ['./view-team.component.css']
})
export class ViewTeamComponent implements OnInit {
  nickname!: string;
  nicknameList: any = [];
  teamTag!: string;
  team!: Team;
  rankIcon!: string;
  displayedColumns = ['icon', 'nickname'];
  ELEMENT_DATA: PeriodicElement[] = [];
  dataSource: any;
  users: any = [];
  isShow = true;
  bool = true;
  selectedValue!: string;
  flag!:string;
  formFields: any = Team.fields();
  filename!: string[];
  file: string = "";
  response!: {dbPath: ''};
  editForm!:FormGroup;
  form: FormGroup = new FormGroup({
    users: new FormControl(''),
  });
  route: string = this.router.url;

  constructor(private router: Router, 
    private teamService: TeamRestService, 
    private restService: UserRestService, 
    private formBuilder: FormBuilder,
    private scroller: ViewportScroller) { }

  ngOnInit(): void {
    this.editForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      tag: new FormControl('', [Validators.required]),
    }); 

    this.getUsers().subscribe((data: {}) => {
      this.users = data;
      console.log(this.users);
      this.populateUsers();
      console.log(this.nicknameList);

      this.form = this.formBuilder.group({
        users: ['', Validators.required],
      },
      {
        validators: [ConfirmedValidator.matchUser('users', this.nicknameList)]
      });
    });
    this.getUser().subscribe((user) => {
      this.nickname = user.nickname!;
      this.getTeam(user.teamTag!).subscribe((team) => {
        this.team = team;
        console.log(this.team);
      });
    });
  }

  populateUsers() {
    this.users.forEach((element:any) => {
      this.nicknameList.push(element.nickname);
    });
  }

  toggleDisplay() {
    this.isShow = !this.isShow;
  }

  // changeFlag(name: string): boolean {
  //   let bool!: boolean
  //   switch(this.flag) {
  //     case 'name':
  //       bool = true;
  //       break;
  //     case 'tag':
  //       bool = true;
  //       break;
  //   }
  //   //console.log(this.flag);
  //   return bool;
  // }

  clickEvent(name: string) {
    this.flag = name;
    console.log(this.flag);
    if(!this.bool) {
      this.bool = true;
    }
    else {
      this.scroller.scrollToAnchor("name");
      this.bool = false;
    }
    
    console.log(this.bool);
  }

  getTeamValue(value: any): string {
    let convert: string = "";
    
    if(this.team != null) {
      let values = Object.entries(this.team!);
      values.forEach(val => {
        if(val[0] == value) {
          convert = val[1];         
        }
      });
    }
    return convert;
  }
  
addRequest(): void {
  this.restService.createRequest(this.selectedValue).subscribe({
    next: () => this.router.navigate(['/']),
    error: (err) => console.log(err)
  });
}

  getTeam(tag: string): Observable<Team> {
    return this.teamService.getTeam(tag);
  }

  getUser() {
    return this.restService.getUser();
  }

  getUsers(): Observable<LinkedList<User>> {
    return this.restService.getUsers();
  }

  getRankIcon(key: any) {
    switch (key) {
      case 'IRON':
        this.rankIcon = './assets/images/ranked-emblems/Emblem_Iron.png';
        break;
      case 'BRONZE':
        this.rankIcon = './assets/images/ranked-emblems/Emblem_Bronze.png';
        break;
      case 'SILVER':
        this.rankIcon = './assets/images/ranked-emblems/Emblem_Silver.png';
        break;
      case 'GOLD':
        this.rankIcon = './assets/images/ranked-emblems/Emblem_Gold.png';
        break;
      case 'PLATINUM':
        this.rankIcon = './assets/images/ranked-emblems/Emblem_Platinum.png';
        break;
      case 'DIAMOND':
        this.rankIcon = './assets/images/ranked-emblems/Emblem_Diamond.png';
        break;
      case 'GRANDMASTER':
        this.rankIcon = './assets/images/ranked-emblems/Emblem_Grandmaster.png';
        break;
      case 'MASTER':
        this.rankIcon = './assets/images/ranked-emblems/Emblem_Master.png';
        break;
      case 'CHALLENGER':
        this.rankIcon = './assets/images/ranked-emblems/Emblem_Challenger.png';
        break;
      default:
        this.rankIcon = './assets/images/ranked-emblems/Emblem_Bronze.png';
        break;
    }
    return this.rankIcon;
  }

  populateTable() {
    const tam = this.team?.numberMembers;
    for (let index = 0; index < tam!; index++) {
      this.ELEMENT_DATA[index] = {
        icon: '', 
        nickname: this.team?.members![index].nickname!
      };
    }
  }

  getClass() {
    return (this.team?.poster == undefined) ? "none" : "caption"; 
  }

  getCompletePercentage(numberMembers: number) {
    let percentage = (numberMembers * 100)/5;
    return percentage;
  }

  changeTitle() {
    return (this.team?.poster) ? 'Change Team Poster' : 'Upload Team Poster';
  }

  public uploadFinished = (event: any) => {
    this.response = event;
    console.log(this.response);
    (this.team!.poster as any) = this.response.dbPath;
    this.filename = (this.team?.poster! as string).split('\\');
    console.log(this.filename);
    this.file = this.filename[2];
  }

  getFileName(): string {
    return (this.filename != undefined) ? this.filename[2] : "No file uploaded yet. Image in JPEG, PNG or GIF format and less than 10MB"; 
  }

  public createImgPath = (serverPath: string) => {
    console.log(serverPath);
    return `https://localhost:5001/${serverPath}`;
  }

  editTeam(): Observable<Team> {
    console.log(this.file);
    const editValues = {
      Name: this.team.name,
      Tag: this.team.tag,
      Poster: this.file,
    } 
    return this.teamService.updateTeam(editValues);
  }

  getErrorMessage() {
    if (this.form.get('users')?.hasError('required')) {
      return 'You must enter a value';
    }

    return (this.form.get('users')?.hasError('users') || this.form.get('users')?.errors?.['matching']) ? "This user doesn't exist." : "";
  }
}
export interface PeriodicElement {
  icon: string;
  nickname: string;
}
