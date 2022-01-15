import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { dateValidator } from '@src/app/CustomValidator';
import { Tournament } from '@src/app/models/tournament';
import { TourneyRestService } from '@src/app/services/tourney-rest/tourney-rest.service';
import { first, take } from 'rxjs/operators';
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

  regions: string[] = [
    'br1',
    'eun1',
    'euw1',
    'jp1',
    'kr',
    'la1',
    'la2',
    'na1',
    'oc1',
    'ru',
    'tr1',
  ];

  constructor(
    private router: Router,
    private tourneyRest: TourneyRestService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      tourneyName: new FormControl(null, [
        Validators.required,
        Validators.pattern('^([A-Z]{1}[A-Za-z]+(([ ]{0,1}[A-Za-z])+[a-z]*)*)$'),
      ]),
      description: new FormControl(null),
      numberTeams: new FormControl(null),
      rank: new FormControl(null),
      region: new FormControl(null),
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
      this.form.get('description')?.value == null ||
      this.form.get('rank')?.value == null ||
      this.form.get('region')?.value == null ||
      !this.form.get('dateTourney')?.valid
    ) {
      return false;
    } else {
      return true;
    }
  }

  save() {
    if (this.isEnable()) {
      var y: number = +this.form.get('numberTeams')?.value;
      var name: String = this.form.get('tourneyName')?.value;
      var description: String = this.form.get('description')?.value;
      var rank: String = this.form.get('rank')?.value;
      var region: String = this.form.get('region')?.value;
      var date: String = this.form.get('dateTourney')?.value;

      this.tourneyRest
        .createTourney({
          Name: name,
          NumberOfTeams: y,
          Description: description,
          Rank: rank,
          Region: region,
          date: date,
        })
        .pipe(first())
        .subscribe((tourney) => {
          alert('Criado com sucesso.');
          window.location.href = '/';
        });
    }
  }
}
