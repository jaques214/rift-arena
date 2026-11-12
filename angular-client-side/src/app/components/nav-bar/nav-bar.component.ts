import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Component, inject, type OnInit, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import type { Request } from '@models/request';
import type { User } from '@models/user';
import { AuthService } from '@services/auth/auth.service';
import { UserRestService } from '@services/user-rest/user-rest.service';
import { environment } from '@src/environments/environment';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
  imports: [
    NgOptimizedImage,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    RouterLink,
  ],
})
export class NavBarComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserRestService);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  response!: { dbPath: '' };
  user: User | null = null;
  profile?: string;
  numberOfRequests: number = 0;
  hasTeam: boolean = false;
  hasLinkedAccount: boolean = false;
  isShow: boolean = true;

  ngOnInit(): void {
    const nickname = this.authService.getCurrentUserNickname();
    this.authService.setCurrentUser(nickname);
    if (nickname) {
      this.user = { nickname, teamTag: null };
    }

    if (this.isBrowser && localStorage.getItem('currentUser') !== null) {
      this.userService.getUser().subscribe({
        next: (user) => {
          this.user = user;
          if (this.user.teamTag !== null) {
            this.hasTeam = true;
          }
          if (this.user.linkedAccount !== null) {
            this.hasLinkedAccount = true;
          }
          this.userService.getRequests().subscribe((requests: Request[]) => {
            this.numberOfRequests = requests.length;
          });
        },
        error: () => {
          if (this.isBrowser) {
            localStorage.removeItem('currentUser');
          }
          this.user = null;
          this.authService.setCurrentUser(null);
        },
      });
    }
  }

  createImgPath = (serverPath: string) => {
    return `${environment.apiUrl}/Resources/Images/${serverPath}`;
  };

  toogleProfileIcon() {
    if (!this.user) return 'assets/images/profile-icon.png';
    return this.user.poster
      ? this.createImgPath(this.user.poster)
      : 'assets/images/profile-icon.png';
  }

  openMenu() {
    this.isShow = !this.isShow;
  }

  logout(): void {
    this.authService.logout();
    if (
      typeof window !== 'undefined' &&
      window.location &&
      typeof window.location.reload === 'function'
    ) {
      window.location.reload();
    }
  }
}
