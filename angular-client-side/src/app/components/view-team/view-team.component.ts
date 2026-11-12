import { NgClass, NgOptimizedImage, ViewportScroller } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { type Team, teamFields } from '@models/team';
import type { User } from '@models/user';
import { TeamRestService } from '@services/team-rest/team-rest.service';
import { UserRestService } from '@services/user-rest/user-rest.service';
import { matchUser } from '@src/app/confirmed.validator';
import { getRankIcon } from '@src/app/shared/utils';
import { environment } from '@src/environments/environment';
import type { Observable } from 'rxjs';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { SharedFormFieldComponent } from '../shared-form-field/shared-form-field.component';
import { UploadComponent, type UploadResponse } from '../upload/upload.component';

@Component({
  selector: 'app-view-team',
  templateUrl: './view-team.component.html',
  styleUrls: ['./view-team.component.css'],
  imports: [
    NavBarComponent,
    MatIconModule,
    MatFormFieldModule,
    MatTooltipModule,
    NgClass,
    SharedFormFieldComponent,
    UploadComponent,
    MatButtonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    NgOptimizedImage,
  ],
})
export class ViewTeamComponent implements OnInit {
  private router = inject(Router);
  private r = inject(ActivatedRoute);
  private teamService = inject(TeamRestService);
  private restService = inject(UserRestService);
  private formBuilder = inject(FormBuilder);
  private scroller = inject(ViewportScroller);

  teamTag: string = this.r.snapshot.params['id'];
  nickname = '';
  nicknameList: string[] = [];
  team!: Team;
  users: User[] = [];
  isShow = true;
  bool = true;
  flag!: string;
  formFields = teamFields();
  filename!: string;
  response!: UploadResponse;
  editForm!: FormGroup;
  form: FormGroup = new FormGroup({
    users: new FormControl(''),
  });

  ngOnInit(): void {
    this.editForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      tag: new FormControl('', [Validators.required]),
    });

    this.getUsers().subscribe((data: User[]) => {
      this.users = data;
      this.populateUsers();

      this.form = this.formBuilder.group(
        {
          users: ['', Validators.required],
        },
        {
          validators: [matchUser('users', this.nicknameList)],
        },
      );
    });
    this.getUser().subscribe((user) => {
      this.nickname = user.nickname ?? '';
      this.teamService.getTeam(this.teamTag).subscribe((team) => {
        this.team = team;
      });
    });
  }

  getRank(key: string) {
    return getRankIcon(key);
  }

  populateUsers() {
    for (const user of this.users) {
      this.nicknameList.push(user.nickname ?? '');
    }
  }

  toggleDisplay() {
    this.isShow = !this.isShow;
  }

  clickEvent(name: string) {
    this.flag = name;
    if (!this.bool) {
      this.bool = true;
    } else {
      this.scroller.scrollToAnchor('name');
      this.bool = false;
    }
  }

  getTeamValue(value: string): string {
    const currentTeam = this.team;

    if (currentTeam != null) {
      const values = Object.entries(currentTeam);
      for (const [key, teamValue] of values) {
        if (key === value) {
          return teamValue === null ? '' : String(teamValue);
        }
      }
    }

    return '';
  }

  addRequest(nickname: string): void {
    this.restService.createRequest(nickname).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => console.log(err),
    });
  }

  getUser() {
    return this.restService.getUser();
  }

  getUsers(): Observable<User[]> {
    return this.restService.getUsers();
  }

  getClass() {
    return this.team?.poster === undefined ? 'none' : 'caption';
  }

  getCompletePercentage(numberMembers: number) {
    return (numberMembers * 100) / 5;
  }

  changeTitle() {
    return this.team?.poster ? 'Change Team Poster' : 'Upload Team Poster';
  }

  public uploadFinished = (event: UploadResponse) => {
    this.response = event;
    this.team.poster = this.response.dbPath;
    this.filename = this.team.poster;
  };

  getFileName(): string {
    return this.filename !== undefined
      ? this.filename
      : 'No file uploaded yet. Image in JPEG, PNG or GIF format and less than 10MB';
  }

  public createImgPath = (serverPath: string) => {
    return `${environment.apiUrl}/Resources/Images/${serverPath}`;
  };

  getErrorMessage() {
    if (this.form.get('users')?.hasError('required')) {
      return 'You must enter a value';
    }

    return this.form.get('users')?.hasError('users') || this.form.get('users')?.errors?.['matching']
      ? "This user doesn't exist."
      : '';
  }

  removeMember(nickname: string) {
    this.teamService.removeMember(nickname).subscribe({
      next: () => window.location.reload(),
      error: (err) => console.log(err),
    });
  }

  removeTeam() {
    this.teamService.deleteTeam().subscribe({
      next: () => window.location.reload(),
      error: (err) => console.log(err),
    });
  }
}
