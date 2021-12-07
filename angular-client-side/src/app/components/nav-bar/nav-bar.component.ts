import { Component, OnInit } from '@angular/core';
import { User } from '@src/app/models/user';
import { AuthService } from '@src/app/services/auth/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  user!: User;
  constructor(public authService: AuthService) {}

  ngOnInit(): void {}

  createUser(): void {
    this.authService
      .register('testetesste@gmail.com', 'coelho310', 'benfica12')
      .subscribe(
        (data: any) => {
          console.log(data);
        },
        (err) => {
          console.log( err);
        }
      );
  }
}
