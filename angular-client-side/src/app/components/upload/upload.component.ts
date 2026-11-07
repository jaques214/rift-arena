import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, inject, input, model, type OnInit, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import type { Team } from '@models/team';
import type { User } from '@models/user';
import { TeamRestService } from '@services/team-rest/team-rest.service';
import { UserRestService } from '@services/user-rest/user-rest.service';
import { environment } from '@src/environments/environment';

export type UploadResponse = {
  dbPath: string;
};

type TeamEditValues = {
  Name?: string;
  Password?: string;
  Email?: string;
  Tag?: string;
  Poster: string;
};

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  imports: [MatButtonModule],
})
export class UploadComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private teamRestService = inject(TeamRestService);
  private userRestService = inject(UserRestService);

  progress!: number;
  message!: string;
  title = input.required<string>();
  onUploadFinished = output<UploadResponse>();
  teamUpdated = output<Team>();
  getUser = model<User>();
  userObj = input<User>();
  teamObj = input<Team>();
  editValues!: TeamEditValues;

  ngOnInit() {}

  uploadFile = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    this.http
      .post<UploadResponse>(`${environment.apiUrl}/api/upload`, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .subscribe((event) => {
        if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round((100 * event.loaded) / event.total!);
        else if (event.type === HttpEventType.Response) {
          if (event.body === null) {
            console.error('Upload endpoint returned an empty response.');
            return;
          }
          this.message = 'Upload success.';
          this.onUploadFinished.emit(event.body);
        }
      });

    const team = this.teamObj();
    const user = this.userObj();

    if (team) {
      this.editValues = {
        Name: team.name,
        Tag: team.tag,
        Poster: fileToUpload.name,
      };
      this.teamRestService.updateTeam(this.editValues).subscribe({
        next: (updatedTeam) => this.teamUpdated.emit(updatedTeam),
        error: (err) => console.log(err),
      });
    } else if (this.router.url === '/profile' && user) {
      this.editValues = {
        Password: user.password,
        Email: user.email,
        Poster: fileToUpload.name,
      };
      this.userRestService.updateUser(this.editValues).subscribe({
        next: () => {
          this.getUser.set(user);
        },
        error: (err) => console.log(err),
      });
    }
  };
}
