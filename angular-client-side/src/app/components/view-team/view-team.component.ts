import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TeamRestService } from '@services/team-rest/team-rest.service';
import { UserRestService } from '@services/user-rest/user-rest.service';
import { Component, OnInit } from '@angular/core';
import { Team } from '@models/team';
import { User } from '@models/user';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import ConfirmedValidator from '@src/app/confirmed.validator';
import {ViewportScroller, NgIf, NgFor, NgClass, NgOptimizedImage} from '@angular/common';
import { getRankIcon } from '@src/app/shared/utils';
import { environment } from '@src/environments/environment';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UploadComponent } from '../upload/upload.component';
import { SharedFormFieldComponent } from '../shared-form-field/shared-form-field.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
    selector: 'app-view-team',
    templateUrl: './view-team.component.html',
    styleUrls: ['./view-team.component.css'],
    standalone: true,
  imports: [NavBarComponent, NgIf, MatIconModule, MatFormFieldModule, MatTooltipModule, NgFor, NgClass, SharedFormFieldComponent, UploadComponent, MatButtonModule, RouterLink, FormsModule, ReactiveFormsModule, MatInputModule, NgOptimizedImage]
})
export class ViewTeamComponent implements OnInit {
  nickname!: string;
  nicknameList: string[] = [];
  teamTag!: string;
  team!: Team;
  users: User[] = new Array<User>();
  isShow = true;
  bool = true;
  flag!: string;
  formFields = Team.fields();
  filename!: string;
  response!: { dbPath: '' };
  editForm!: FormGroup;
  form: FormGroup = new FormGroup({
    users: new FormControl(''),
  });

  constructor(private router: Router,
    private r: ActivatedRoute,
    private teamService: TeamRestService,
    private restService: UserRestService,
    private formBuilder: FormBuilder,
    private scroller: ViewportScroller) {
    this.teamTag = this.r.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.editForm = new FormGroup({
            name: new FormControl('', [Validators.required]),
            tag: new FormControl('', [Validators.required]),
          });

          this.getUsers().subscribe((data: User[]) => {
            this.users = data;
            this.populateUsers();

            this.form = this.formBuilder.group({
                users: ['', Validators.required],
              },
              {
                validators: [ConfirmedValidator.matchUser('users', this.nicknameList)]
        });
    });
    this.getUser().subscribe((user) => {
      this.nickname = user.nickname!;
      this.getTeam(this.teamTag).subscribe((team) => {
        this.team = team;
      });
    });
  }

  getRank(key: string) {
    return getRankIcon(key);
  }

  populateUsers() {
    for (const user of this.users) {
      this.nicknameList.push(user.nickname!);
    }
  }

  toggleDisplay() {
    this.isShow = !this.isShow;
  }

  clickEvent(name: string) {
    this.flag = name;
    if (!this.bool) {
      this.bool = true;
    }
    else {
      this.scroller.scrollToAnchor("name");
      this.bool = false;
    }
  }

  getTeamValue(value: string): string {
    let convert: string = "";

    if (this.team != null) {
      let values = Object.entries(this.team!);
      values.forEach(val => {
        if (val[0] == value) {
          convert = val[1];
        }
      });
    }
    return convert;
  }

  addRequest(nickname: string): void {
    this.restService.createRequest(nickname).subscribe({
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

  getUsers(): Observable<User[]> {
    return this.restService.getUsers();
  }

  getClass() {
    return (this.team?.poster == undefined) ? "none" : "caption";
  }

  getCompletePercentage(numberMembers: number) {
    return (numberMembers * 100) / 5;
  }

  changeTitle() {
    return (this.team?.poster) ? 'Change Team Poster' : 'Upload Team Poster';
  }

  public uploadFinished = (event: any) => {
    this.response = event;
    (this.team!.poster as any) = this.response.dbPath;
    this.filename = this.team?.poster!;
  }

  getFileName(): string {
    return (this.filename != undefined) ? this.filename : "No file uploaded yet. Image in JPEG, PNG or GIF format and less than 10MB";
  }

  public createImgPath = (serverPath: string) => {
    return `${environment.apiUrl}/Resources/Images/${serverPath}`;
  }

  getErrorMessage() {
    if (this.form.get('users')?.hasError('required')) {
      return 'You must enter a value';
    }

    return (this.form.get('users')?.hasError('users') || this.form.get('users')?.errors?.['matching']) ? "This user doesn't exist." : "";
  }

  removeMember(nickname: string) {
    this.teamService.removeMember(nickname).subscribe({
      next: () => window.location.reload(),
      error: (err) => console.log(err)
    });
  }

  removeTeam() {
    this.teamService.deleteTeam().subscribe({
      next: () => window.location.reload(),
      error: (err) => console.log(err)
    });
  }
}
