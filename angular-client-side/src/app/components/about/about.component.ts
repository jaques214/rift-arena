import { Component, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css'],
    imports: [NavBarComponent, NgOptimizedImage]
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
