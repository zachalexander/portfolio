import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  mobile = false;

  constructor() { }

  ngOnInit() {
    if (window.innerWidth <= 767) {
      this.mobile = true;
    }
  }


  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    const element = document.querySelector('.nav-wrapper');
    const orangeDiv = document.querySelector('.mid1-left');
    const topOfOrangeDiv = orangeDiv.getBoundingClientRect()['y'];

    if (window.innerWidth >= 767) {
      if (topOfOrangeDiv < 1800) {
        element.classList.add('nav-wrapper-light');
      } else {
        element.classList.remove('nav-wrapper-light');
      }
    } else {
      if (topOfOrangeDiv < 2500) {
        element.classList.add('nav-wrapper-light');
      } else {
        element.classList.remove('nav-wrapper-light');
      }
    }


  }

}
