import { Component, OnInit } from '@angular/core';

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
    { value: 'stageone', viewValue: 'Stage1' },
    { value: 'stagetwo', viewValue: 'Stage2' },
    { value: 'stagen', viewValue: 'StageN' },
  ];
  selectedStage = this.stages[0].value;

  constructor() {}

  ngOnInit(): void {}
}
