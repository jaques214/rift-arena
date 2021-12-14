import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { UserRestService } from '@services/user-rest/user-rest.service';
import {User} from '@models/user'
import { LinkedAccount } from '@models/linked_acount';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {
  user1 = {
    nickname: "nickname1"
  }
  user!: User;
  list: LinkedAccount[] = [];
  fileSelected?: File;
  image = (this.user?.profileImage as unknown as string);
  imageFieldPath = 'http://localhost:5001/api/' + this.image;
  imageFieldName: string = this.normalizeImageName(this.image);

  constructor(private restService : UserRestService, private route: ActivatedRoute, private router: Router) { }

  getUser(userId: number): Observable<any> {
    return this.restService.getUser(userId);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if(id && !this.user){
      this.getUser(id).subscribe((user) => {
        this.user = user;
      });
    }
  }

  normalizeImageName(imagePath: string): string {
    return imagePath?.split('_')?.splice(2)?.join('_');
  }

  onFileSelected(user: any): void {
    const target: HTMLInputElement | null = user.target as HTMLInputElement;
    this.fileSelected = target?.files?.[0] as File;
  }

  editUser(user: User): void {
    this.restService.updateUser(user).subscribe({
      next: () => {
        this.getUser(user.userId!).subscribe((user) => {
          this.user = user;
        });
      },
      error: error => {
        // TODO: have error handling 
      }
    });
  }

}
