import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.css'],
})
export class CreateTeamComponent implements OnInit {
  form!: FormGroup;
  constructor() {}

  ngOnInit(): void {
    this.form = new FormGroup({
      teamName: new FormControl(null, [
        Validators.required,
        Validators.pattern('^([A-Z]{1}[A-Za-z]+(([ ]{0,1}[A-Za-z])+[a-z]*)*)$'),
      ]),
      tagName: new FormControl(null, [
        Validators.required,
      ]),
    });
  }
  save(){

  }
}

