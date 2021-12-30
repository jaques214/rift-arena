import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-shared-form-field',
  templateUrl: './shared-form-field.component.html',
  styleUrls: ['./shared-form-field.component.css']
})
export class SharedFormFieldComponent implements OnInit {
  @Input() input!:any;
  @Input() type?:any;
  hide = true;
  regionValues = ['br1', 'eun1', 'euw1', 'jp1', 'kr', 'la1', 'la2', 'na1', 'oc1', 'ru', 'tr1'];

  constructor() { }

  ngOnInit(): void {
    this.type || (this.type = this.input.type)
  }
}