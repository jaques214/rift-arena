import {Component, OnInit} from "@angular/core";
import {MatRadioModule} from "@angular/material/radio";
import {NavBarComponent} from "../nav-bar/nav-bar.component";
import {TeamRestService} from "@services/team-rest/team-rest.service";
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {STEPPER_GLOBAL_OPTIONS} from "@angular/cdk/stepper";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatStepperModule} from "@angular/material/stepper";
import {Team} from "@models/team";
import {Observable} from "rxjs";

interface Stage {
  value: string;
  viewValue: string;
}

type RadioGroupType = {
  v: string;
}

@Component({
  selector: "app-manage-tourney",
  templateUrl: "./manage-tourney.component.html",
  styleUrls: ["./manage-tourney.component.css"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ],
  standalone: true,
  imports: [
    NavBarComponent,
    MatRadioModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class ManageTourneyComponent implements OnInit {
  stages: Stage[] = [
    {value: "1", viewValue: "Stage1"},
    {value: "2", viewValue: "Stage2"},
    {value: "3", viewValue: "StageN"},
  ];

  radioButton: { value: string[] }[] = [
    {value: ["team1", "team2"]},
    {value: ["team3", "team4"]},
    {value: ["team5", "team6"]},
  ];
  teams: Team[] = [];
  radioGroup: RadioGroupType[] = [{v: "abc"}, {v: "xas"}, {v: "asd"}];

  s: number = this.stages.length - 1;
  selectedStage = this.stages[0].value;
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ["", Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ["", Validators.required],
  });

  constructor(private teamService: TeamRestService, private _formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.getTeams().subscribe((data: Team[]) => {
      this.teams = data;

    });
  }

  // array n radio_group

  // getValue(event: MatRadioChange) {
  //   console.log(event.value);
  // }

  getTeams(): Observable<Team[]> {
    return this.teamService.getTeams();
  }

  getAllValues() {
    let results: string[] = [];

    this.radioGroup.forEach((result: RadioGroupType) => {
      results.push(result.v);
    });
  }

}
