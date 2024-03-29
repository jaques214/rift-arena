import { Component, OnInit } from '@angular/core';
import { User } from '@models/user';
import { AuthService } from '@services/auth/auth.service';
import { UserRestService } from '@services/user-rest/user-rest.service';
import { environment } from '@src/environments/environment';
import {NgIf, NgOptimizedImage} from '@angular/common';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrl: './nav-bar.component.css',
    standalone: true,
  imports: [NgIf, NgOptimizedImage],
})
export class NavBarComponent implements OnInit {
  response!: { dbPath: '' };
  user: User = new User();
  profile?: string;
  numberOfRequests: number = 0;
  hasTeam: boolean = false;
  hasLinkedAccount: boolean = false;

  constructor(
    private userService: UserRestService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('currentUser') != null) {
      this.userService.getUser().subscribe({
        next: (user) => {
          this.user = user;
          if (this.user.teamTag != null) {
            this.hasTeam = true;
          } if (this.user.linkedAccount != null) {
            this.hasLinkedAccount = true;
          }
          this.userService.getRequests().subscribe((requests: any) => {
            this.numberOfRequests = requests.length;
          });
        },
        error: () => localStorage.removeItem('currentUser')
      });
    }
  }

  createImgPath = (serverPath: string) => {
    return `${environment.apiUrl}/Resources/Images/${serverPath}`;
  }

  toogleProfileIcon() {
    let imageFieldPath = this.createImgPath(this.user?.poster!);
    return this.user?.poster ? imageFieldPath : 'assets/images/profile-icon.png';
  }

  logout(): void {
    this.authService.logout();
    window.location.reload();
  }
}
