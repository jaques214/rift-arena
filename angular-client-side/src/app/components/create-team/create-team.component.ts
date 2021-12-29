import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TeamRestService } from '@src/app/services/team-rest/team-rest.service';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.css'],
})
export class CreateTeamComponent implements OnInit {
  form!: FormGroup;

  constructor(private teamService: TeamRestService, private router: Router) {}

  ngOnInit(): void {
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

  isEnable(): boolean {
    if (!this.form.get('teamName')?.valid || !this.form.get('tagName')?.valid) {
      return false;
    } else {
      return true;
    }
  }

  save() {
    if (this.isEnable()) {
      let tag: string = this.form.get('tagName')?.value;
      let teamName: string = this.form.get('teamName')?.value;
      console.log(typeof(tag) );
      console.log(typeof(teamName));

      this.teamService.createTeam(tag, teamName).subscribe(
        () => {
          this.router.navigate(['']);
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
  }
}
