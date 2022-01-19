import { TourneyRestService } from '@src/app/services/tourney-rest/tourney-rest.service';
import { Router } from '@angular/router';
import { UserRestService } from '@services/user-rest/user-rest.service';
import { TeamRestService } from '@services/team-rest/team-rest.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { HttpEventType, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  progress!: number;
  message!: string;
  @Input() title!: string;
  @Output() onUploadFinished = new EventEmitter();
  @Input() getObj!: Observable<any>;
  @Input() obj!:any;  
  editValues!:any;

  constructor(private http: HttpClient, 
    private router: Router,
    private tourneyRestService: TourneyRestService,
    private teamRestService: TeamRestService,
    private userRestService: UserRestService) { }

  ngOnInit() {
  }

  uploadFile = (files: any) => {
    if (files.length === 0) {
      return;
    }

    let fileToUpload = <File>files[0];
    console.log(fileToUpload);
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    this.http.post('https://localhost:5001/api/upload', formData, {reportProgress: true, observe: 'events'})
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round(100 * event.loaded / event.total!);
        else if (event.type === HttpEventType.Response) {
          this.message = 'Upload success.';
          this.onUploadFinished.emit(event.body);
        }
      });

    //console.log(this.filename);
    if(this.router.url == '/view-my-team') {
      this.editValues = {
        Name: this.obj.name,
        Tag: this.obj.tag,
        Poster: fileToUpload.name,
      } 
      console.log(this.editValues);
      this.teamRestService.updateTeam(this.editValues).subscribe({
        next: () => {
          this.getObj.subscribe((obj) => {
            this.obj = obj;
            console.log(this.obj);
          });
        },
        error: (err) => console.log(err)
      });
    }
    else if(this.router.url == '/profile') {
      this.editValues = {
        Password: this.obj.password,
        Email: this.obj.email,
        Poster: fileToUpload.name,
      } 
      this.userRestService.updateUser(this.editValues).subscribe({
        next: () => {
          this.getObj.subscribe((obj) => {
            this.obj = obj;
            console.log(this.obj);
          });
        },
        error: (err) => console.log(err)
      });
    }
  }
}
