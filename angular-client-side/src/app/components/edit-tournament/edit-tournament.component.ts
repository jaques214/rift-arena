import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { dateValidator } from '@src/app/CustomValidator';
import { Tournament } from '@src/app/models/tournament';
import { TourneyRestService } from '@src/app/services/tourney-rest/tourney-rest.service';
import { RANK_LIST } from '@src/app/shared/utils';
import { first, Observable } from 'rxjs';

@Component({
  selector: 'app-edit-tournament',
  templateUrl: './edit-tournament.component.html',
  styleUrls: ['./edit-tournament.component.css']
})
export class EditTournamentComponent implements OnInit {
  form!: FormGroup;
  tourney!: Tournament
  filename!: string;
  response!: {dbPath: ''};
  ranks: string[] = RANK_LIST;
  id!: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tourneyRest: TourneyRestService
  ) {
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getTourney(this.id).subscribe(tourney => {
      next: () => this.tourney = tourney
      error: () => this.router.navigate([''])
    });
  
    this.form = new FormGroup({
      tourneyName: new FormControl(null, [
        Validators.required,
        Validators.pattern('^([A-Z]{1}[A-Za-z]+(([ ]{0,1}[A-Za-z])+[a-z]*)*)$'),
      ]),
      description: new FormControl(null),
      maxTeams: new FormControl(null),
      rank: new FormControl(null),
      dateTourney: new FormControl(null, [
        Validators.required,
        dateValidator(),
      ]), 
    });
  }

  public uploadFinished = (event: any) => {
    this.response = event;
    console.log(this.response);
    this.filename = this.response.dbPath;
    // (this.tourney!.poster as any) = this.response.dbPath;
    // this.filename = this.tourney?.poster!;
    console.log(this.filename);
  }

  getFileName(): string {
    return (this.filename != undefined) ? this.filename : "No file uploaded yet. Image in JPEG, PNG or GIF format and less than 10MB"; 
  }

  getTourney(id: number): Observable<Tournament> {
    return this.tourneyRest.getTourney(id);
  }

  isEnable(): boolean {
    if (
      !this.form.get('tourneyName')?.valid ||
      this.form.get('maxTeams')?.value == null ||
      this.form.get('description')?.value == null ||
      this.form.get('rank')?.value == null ||
      !this.form.get('dateTourney')?.valid ||
      this.filename == undefined
    ) {
      return false;
    } else {
      return true;
    }
  }

  save() {
    if (this.isEnable()) {
      var y: number = this.form.get('maxTeams')?.value;
      console.log(y);
      var name: String = this.form.get('tourneyName')?.value;
      var description: String = this.form.get('description')?.value;
      var rank: String = this.form.get('rank')?.value;
      var date: String = this.form.get('dateTourney')?.value;

      this.tourneyRest
        .updateTourney({
          Name: name,
          MaxTeams: y,
          Description: description,
          Rank: rank,
          date: date,
          Poster: this.filename
        }, this.id)
        .pipe(first())
        .subscribe((tourney) => {
          alert('Atualizado com sucesso.');
          window.location.href = '/';
        });
    }
  }
}
