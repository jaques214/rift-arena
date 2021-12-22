import { Component, OnInit, Input } from '@angular/core';
//import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-shared-form-field',
  templateUrl: './shared-form-field.component.html',
  styleUrls: ['./shared-form-field.component.css']
})
export class SharedFormFieldComponent implements OnInit {
  @Input() input!:any;
  @Input() type?:any;
  hide = true;
  //email = new FormControl('', [Validators.required, Validators.email]);

  constructor() { }

  ngOnInit(): void {
    this.type || (this.type = this.input.type)
  }

  /*getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }*/

}
