import { Component, OnInit } from '@angular/core';
import { User } from '@models/user';
import { AuthService } from '@services/auth/auth.service';
import { UserRestService } from '@services/user-rest/user-rest.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  public response!: {dbPath: ''};
  user?: User;
  profile?: string;
  numberOfRequests: number = 0;
  hasTeam: boolean = false;

  constructor(
    private userService: UserRestService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('currentUser') !== null) {
      this.userService.getUser().subscribe({
        next: (user) => {
          this.user = user;
          if (this.user.teamTag != null) {
            this.hasTeam = true;
          }
          this.userService.getRequests().subscribe((requests: any) => {
            this.numberOfRequests = requests.length;
            console.log(this.numberOfRequests);
          });
        },
        error: () => localStorage.removeItem('currentUser')
      });
    }
  }

  createImgPath = (serverPath: string) => {
    return `https://localhost:5001/${serverPath}`;
  }

  public uploadFinished = (event: any) => {
    this.response = event;
  }

  toogleProfileIcon() {
    let imageFieldPath = this.createImgPath(this.response?.dbPath);
    return this.response?.dbPath ? imageFieldPath : 'assets/images/profile-icon.png';
  }

  logout(): void {
    this.authService.logout();
    window.location.reload();
  }
}
