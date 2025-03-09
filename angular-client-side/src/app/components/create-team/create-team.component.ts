import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TeamRestService } from '@src/app/services/team-rest/team-rest.service';
import { UserRestService } from '@src/app/services/user-rest/user-rest.service';
import { NgIf, NgClass } from '@angular/common';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
    selector: 'app-create-team',
    templateUrl: './create-team.component.html',
    styleUrls: ['./create-team.component.css'],
    standalone: true,
    imports: [
        NavBarComponent,
        NgIf,
        FormsModule,
        ReactiveFormsModule,
        NgClass,
    ],
})
export class CreateTeamComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private teamService: TeamRestService,
    private userService: UserRestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem("currentUser") != null) {
      this.userService.getUser().subscribe({
        next: async (user) => {
          if (user.teamTag != null) {
            await this.router.navigate(['/']);
          }
          if (user.linkedAccount === undefined) {
            this.router.navigate(['/']).then(nav => {
              console.log(nav); // true if navigation is successful
            }, err => {
              console.log(err) // when there's an error
            });
          }
        }
      });

      this.form = new FormGroup({
        teamName: new FormControl(null, [
          Validators.required,
          Validators.pattern('^([A-Z]{1}[A-Za-z]+(([ ]{0,1}[A-Za-z])+[a-z]*)*)$'),
        ]),
        tagName: new FormControl(null, [
          Validators.required,
          Validators.pattern('^[A-Z]{3}$'),
        ]),
      });
    }
  }

  isEnable(): boolean {
    return !(!this.form.get('teamName')?.valid || !this.form.get('tagName')?.valid);
  }

  save() {
    if (this.isEnable()) {
      let tag: string = this.form.get('tagName')?.value;
      let teamName: string = this.form.get('teamName')?.value;

      this.teamService.createTeam(tag, teamName).subscribe({
        next: () => this.router.navigate(['']),
        error: (err: any) => console.log(err)
      });
    }
  }
}
