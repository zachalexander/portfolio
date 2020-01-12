import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  mobile = false;

  constructor() { }
  
  ngOnInit() {
    if(window.innerWidth <= 767) {
      this.mobile = true;
      console.log(this.mobile);
    }
  }
  
  @HostListener('window:scroll', ['$event'])

  onWindowScroll(e) {
    const element = document.querySelector('.nav-wrapper');
    const orangeDiv = document.querySelector('.mid2-left');
    const topOfOrangeDiv = orangeDiv.getBoundingClientRect()['y'];

    if (window.innerWidth >= 767) {
      if (topOfOrangeDiv < 70 && topOfOrangeDiv > -925) {
        element.classList.add('nav-wrapper-light');
      } else {
        element.classList.remove('nav-wrapper-light');
      }
    } else {
      if (topOfOrangeDiv < 70 && topOfOrangeDiv > -325) {
        element.classList.add('nav-wrapper-light');
      } else {
        element.classList.remove('nav-wrapper-light');
      }
    }


  }

}
