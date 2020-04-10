import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-navbarxhome',
  templateUrl: './navbarxhome.component.html',
  styleUrls: ['./navbarxhome.component.scss']
})
export class NavbarxhomeComponent implements OnInit {

  constructor() { }
  mobile = false;

  ngOnInit() {
    if (window.innerWidth <= 767) {
      this.mobile = true;
    }
  }


  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    const element = document.querySelector('.nav-wrapper');
    element.classList.add('nav-wrapper-light');
  }
}
