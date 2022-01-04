import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { dateValidator } from '@src/app/CustomValidator';

@Component({
  selector: 'app-create-tourney',
  templateUrl: './create-tourney.component.html',
  styleUrls: ['./create-tourney.component.css'],
})
export class CreateTourneyComponent implements OnInit {
  form!: FormGroup;
  ranks: string[] = [
    'Iron',
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Diamond',
    'Grandmaster',
    'Master',
    'Challenger',
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      tourneyName: new FormControl(null, [
        Validators.required,
        Validators.pattern('^([A-Z]{1}[A-Za-z]+(([ ]{0,1}[A-Za-z])+[a-z]*)*)$'),
      ]),
      numberTeams: new FormControl(null),
      rank: new FormControl(null),
      dateTourney: new FormControl(null, [
        Validators.required,
        dateValidator(),
      ]),
    });
  }

  isEnable(): boolean {
    if (
      !this.form.get('tourneyName')?.valid ||
      this.form.get('numberTeams')?.value == null ||
      this.form.get('rank')?.value == null ||
      !this.form.get('dateTourney')?.valid
    ) {
      return false;
    } else {
      return true;
    }
  }

  save() {
    if (this.isEnable()) {
      // TO DO: create tourney service
    }
  }
}
