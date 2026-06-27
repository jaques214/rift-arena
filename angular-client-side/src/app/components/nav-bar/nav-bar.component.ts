import { Component, inject, OnInit } from '@angular/core';
import { User } from '@models/user';
import { AuthService } from '@services/auth/auth.service';
import { UserRestService } from '@services/user-rest/user-rest.service';
import { environment } from '@src/environments/environment';
import { NgOptimizedImage } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { RouterLink } from "@angular/router";
import { Request } from "@models/request";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
  imports: [NgOptimizedImage, MatIconModule, MatToolbarModule, MatButtonModule, MatMenuModule, RouterLink],
})
export class NavBarComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserRestService);

  response!: { dbPath: '' };
  user: User = new User();
  profile?: string;
  numberOfRequests: number = 0;
  hasTeam: boolean = false;
  hasLinkedAccount: boolean = false;
  isShow: boolean = true;

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('currentUser') != null) {
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
        error: () => { if (typeof localStorage !== 'undefined') localStorage.removeItem('currentUser'); }
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

  openMenu() {
    this.isShow = !this.isShow;
  }

  logout(): void {
    this.authService.logout();
    if (typeof window !== 'undefined' && window.location && typeof window.location.reload === 'function') {
      window.location.reload();
    }
  }
}
