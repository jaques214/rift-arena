import { Component, OnInit } from '@angular/core';
import { User } from '@src/app/models/user';
import { AuthService } from '@src/app/services/auth/auth.service';
import { UserRestService } from '@src/app/services/user-rest/user-rest.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  user!: User;
  constructor(public userService: UserRestService) {}

  ngOnInit(): void {}

}
