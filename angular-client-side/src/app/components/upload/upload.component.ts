import { Router } from '@angular/router';
import { UserRestService } from '@services/user-rest/user-rest.service';
import { TeamRestService } from '@services/team-rest/team-rest.service';
import {Component, OnInit, WritableSignal, inject, input, output, model} from "@angular/core";
import { HttpEventType, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@src/environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { Team } from '@src/app/models/team';
import { User } from '@src/app/models/user';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.css'],
    imports: [MatButtonModule]
})
export class UploadComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private teamRestService = inject(TeamRestService);
  private userRestService = inject(UserRestService);

  progress!: number;
  message!: string;
  title = input.required<string>();
  onUploadFinished = output<unknown>();
  getUser = model<WritableSignal<User>>();
  getTeam = input<Observable<Team>>();
  userObj = input<User>();
  teamObj = input<Team>();
  editValues!: any;

  ngOnInit() {
  }

  uploadFile = (files: any) => {
    if (files.length === 0) {
      return;
    }

    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    this.http.post(`${environment.apiUrl}/api/upload`, formData, { reportProgress: true, observe: 'events' })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round(100 * event.loaded / event.total!);
        else if (event.type === HttpEventType.Response) {
          this.message = 'Upload success.';
          this.onUploadFinished.emit(event.body);
        }
      });

    if (this.router.url == '/view-my-team' && this.teamObj() !== undefined) {
      this.editValues = {
        Name: this.teamObj().name,
        Tag: this.teamObj().tag,
        Poster: fileToUpload.name,
      }
      this.teamRestService.updateTeam(this.editValues).subscribe({
        next: () => {
          this.getTeam?.subscribe((obj) => {
            this.teamObj = obj;
          });
        },
        error: (err) => console.log(err)
      });
    }
    else if (this.router.url == '/profile') {
      this.editValues = {
        Password: this.userObj().password,
        Email: this.userObj().email,
        Poster: fileToUpload.name,
      }
      this.userRestService.updateUser(this.editValues).subscribe({
        next: () => {
          this.getUser?.set(this.userObj());
        },
        error: (err) => console.log(err)
      });
    }
  }
}
