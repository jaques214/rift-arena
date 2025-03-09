import { Component, OnInit } from '@angular/core';
import { User } from '@models/user';
import { AuthService } from '@services/auth/auth.service';
import { UserRestService } from '@services/user-rest/user-rest.service';
import { environment } from '@src/environments/environment';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {RouterLink} from "@angular/router";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import {Request} from "@models/request";

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrl: './nav-bar.component.css',
    standalone: true,
  imports: [NgIf, NgOptimizedImage, MatIconModule, MatToolbarModule, MatButtonModule, MatMenuModule, RouterLink],
  animations: [
    trigger('openClose', [
      state('open', style({
        height: '100%',
      })),
      state('closed', style({
        height: '0px',
      })),
      transition('closed => open', [
        animate('0.3s')
      ]),
      transition('open => closed', [
        animate('0.3s')
      ]),
    ]),
  ]
})
export class NavBarComponent implements OnInit {
  response!: { dbPath: '' };
  user: User = new User();
  profile?: string;
  numberOfRequests: number = 0;
  hasTeam: boolean = false;
  hasLinkedAccount: boolean = false;
  isShow: boolean = true;

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
          this.userService.getRequests().subscribe((requests: Request[]) => {
            this.numberOfRequests = requests.length;
          });
        },
        error: () => localStorage.removeItem('currentUser')
      });
    }
    console.log(this.user);
  }

  createImgPath = (serverPath: string) => {
    return `${environment.apiUrl}/Resources/Images/${serverPath}`;
  }

  toogleProfileIcon() {
    let imageFieldPath = this.createImgPath(this.user?.poster!);
    return this.user?.poster ? imageFieldPath : 'assets/images/profile-icon.png';
  }

  openMenu() {
    this.isShow = !this.isShow;
    console.log(this.isShow)
  }

  logout(): void {
    this.authService.logout();
    window.location.reload();
  }
}
