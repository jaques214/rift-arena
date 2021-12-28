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
  user?: User;
  profile?:string;

  constructor(
    private userService: UserRestService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('currentUser') !== null) {
      this.userService
        .getUser(JSON.parse(localStorage.getItem('currentUser')!).id)
        .subscribe((user) => {
          this.user = user;
        });
      }
      //console.log(this.user)
  }

  myProfile(){
    this.profile = `/profile/${this.user?.userID}`;
    return this.profile;
  }

  toogleProfileIcon(){
    let imageFieldPath = 'http://localhost:5001/api/' + this.user?.profileImage;
    return this.user?.profileImage ? imageFieldPath : "assets/images/profile-icon.png";
  }

  logout(): void {
    this.authService.logout();
    window.location.reload();
  }
}
