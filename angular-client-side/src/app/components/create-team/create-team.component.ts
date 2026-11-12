import { isPlatformBrowser, NgClass } from '@angular/common';
import { Component, inject, type OnInit, PLATFORM_ID } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TeamRestService } from '@src/app/services/team-rest/team-rest.service';
import { UserRestService } from '@src/app/services/user-rest/user-rest.service';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.css'],
  imports: [NavBarComponent, FormsModule, ReactiveFormsModule, NgClass],
})
export class CreateTeamComponent implements OnInit {
  private teamService = inject(TeamRestService);
  private userService = inject(UserRestService);
  private router = inject(Router);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  form!: FormGroup;

  ngOnInit(): void {
    if (this.isBrowser && localStorage.getItem('currentUser') != null) {
      this.userService.getUser().subscribe({
        next: async (user) => {
          if (user.teamTag != null) {
            await this.router.navigate(['/']);
          }
          if (user.linkedAccount === undefined) {
            this.router.navigate(['/']).then(
              (nav) => {
                console.log(nav); // true if navigation is successful
              },
              (err) => {
                console.log(err); // when there's an error
              },
            );
          }
        },
      });

      this.form = new FormGroup({
        teamName: new FormControl(null, [
          Validators.required,
          Validators.pattern('^([A-Z]{1}[A-Za-z]+(([ ]{0,1}[A-Za-z])+[a-z]*)*)$'),
        ]),
        tagName: new FormControl(null, [Validators.required, Validators.pattern('^[A-Z]{3}$')]),
      });
    }
  }

  isEnable(): boolean {
    return !(!this.form.get('teamName')?.valid || !this.form.get('tagName')?.valid);
  }

  save() {
    if (this.isEnable()) {
      const tag: string = this.form.get('tagName')?.value;
      const teamName: string = this.form.get('teamName')?.value;

      this.teamService.createTeam(tag, teamName).subscribe({
        next: () => this.router.navigate(['']),
        error: (err) => console.log(err),
      });
    }
  }
}
