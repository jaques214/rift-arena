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
  @Input() updateObj!: Observable<any>;
  @Input() getObj!: Observable<any>;
  obj!:any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  uploadFile = (files: any) => {
    if (files.length === 0) {
      return;
    }

    let fileToUpload = <File>files[0];
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
    this.updateObj.subscribe({
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
