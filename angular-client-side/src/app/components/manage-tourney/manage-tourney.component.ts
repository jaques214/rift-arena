import { Component, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';

interface Stage {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-manage-tourney',
  templateUrl: './manage-tourney.component.html',
  styleUrls: ['./manage-tourney.component.css'],
})
export class ManageTourneyComponent implements OnInit {
  stages: Stage[] = [
    { value: '1', viewValue: 'Stage1' },
    { value: '2', viewValue: 'Stage2' },
    { value: '3', viewValue: 'StageN' },
  ];

  radioButton: any[] = [
    { value: ['team1', 'team2'] },
    { value: ['team3', 'team4'] },
    { value: ['team5', 'team6'] },
  ];

  radioGroup: any[] = [{ v: 'abc' }, { v: 'xas' }, { v: 'asd' }];

  s: any = this.stages.length - 1;
  selectedStage = this.stages[0].value;

  constructor() {}

  ngOnInit(): void {}

  // array n radio_group

  // getValue(event: MatRadioChange) {
  //   console.log(event.value);
  // }

  getAllValues() {
    let results: string[] = [];

    this.radioGroup.forEach((result: any) => {
      results.push(result.v);
    });
  }
  
}
