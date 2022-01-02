import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-shared-form-field',
  templateUrl: './shared-form-field.component.html',
  styleUrls: ['./shared-form-field.component.css']
})
export class SharedFormFieldComponent implements OnInit {
  @Input() input!:any;
  @Input() type?:any;
  @Output() valueOnChange = new EventEmitter<string>();
  hide = true;
  listValues: string[] = [];
  selected: string = this.listValues[0];

  constructor() {
  }
  
  ngOnInit(): void {
    this.type || (this.type = this.input.type);
  }
  
  fieldOnChange(selected: string){
    this.valueOnChange.emit(selected);
  }
}