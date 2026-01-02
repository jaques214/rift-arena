import { Tournament } from '@models/tournament';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { dateValidator } from '@app/CustomValidator';
import { TourneyRestService } from '@services/tourney-rest/tourney-rest.service';
import { first } from 'rxjs/operators';
import {RANK_LIST} from '@app/shared/utils';
import { Observable } from 'rxjs';
import { UploadComponent } from '../upload/upload.component';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
    selector: 'app-create-tourney',
    templateUrl: './create-tourney.component.html',
    styleUrls: ['./create-tourney.component.css'],
    imports: [
        NavBarComponent,
        NgIf,
        FormsModule,
        ReactiveFormsModule,
        NgFor,
        NgClass,
        UploadComponent,
    ]
})
export class CreateTourneyComponent implements OnInit {
  form!: FormGroup;
  tourney!: Tournament
  filename!: string;
  response!: {dbPath: ''};
  ranks: string[] = RANK_LIST;

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
      maxTeams: new FormControl(null),
      rank: new FormControl(null),
      region: new FormControl(null),
      dateTourney: new FormControl(null, [
        Validators.required,
        dateValidator(),
      ]),
    });
  }

  public uploadFinished = (event: any) => {
    this.response = event;
    this.filename = this.response.dbPath;
  }

  getFileName(): string {
    return (this.filename != undefined) ? this.filename : "No file uploaded yet. Image in JPEG, PNG or GIF format and less than 10MB";
  }

  getTourney(id: number): Observable<Tournament> {
    return this.tourneyRest.getTourney(id);
  }

  isEnable(): boolean {
    return !(!this.form.get('tourneyName')?.valid ||
      this.form.get('maxTeams')?.value == null ||
      this.form.get('description')?.value == null ||
      this.form.get('rank')?.value == null ||
      this.form.get('region')?.value == null ||
      !this.form.get('dateTourney')?.valid ||
      this.filename == undefined);
  }

  save() {
    if (this.isEnable()) {
      const y: number = this.form.get('maxTeams')?.value;
      const name: String = this.form.get('tourneyName')?.value;
      const description: String = this.form.get('description')?.value;
      const rank: String = this.form.get('rank')?.value;
      const region: String = this.form.get('region')?.value;
      const date: String = this.form.get('dateTourney')?.value;

      this.tourneyRest
        .createTourney({
          Name: name,
          MaxTeams: y,
          Description: description,
          Rank: rank,
          Region: region,
          date: date,
          Poster: this.filename
        })
        .pipe(first())
        .subscribe(() => {
          alert('Criado com sucesso.');
          window.location.href = '/';
        });
    }
  }
}
