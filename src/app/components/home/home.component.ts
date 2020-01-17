import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HostListener } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  mobile = false;
  showDiv = false;

  constructor() { }

  ngOnInit() {
    if(window.innerWidth <= 767) {
      this.mobile = true;
    }
    const text1 = 'Hello, welcome';
    this.typingAnimation(text1, '.line1');

    setTimeout(() => {
      this.showDiv = true;
      const text2 = 'to my portfolio.';
      this.typingAnimation(text2, '.line2');
    }, 3400);
  }

  @HostListener('window:scroll', ['$event'])

  onWindowScroll(e) {
    const element = document.querySelector('.nav-wrapper');
    const orangeDiv = document.querySelector('.mid2-left');
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

  typingAnimation(text, classname) {
    let progress = 0;
    d3.interval(function() {
      const r = Math.random();
      if (r < 0.8) {
        if ((r < 0.1) && (progress > 0.2)) {
          progress -= 0.01;
        } else {
          progress += 0.01;
        }
        // console.log(progress);

      const text_val = text;

      const text_progress = Math.max(0, Math.min( text_val.length + 1, Math.floor(progress * text_val.length)));

      d3.select(classname)
        .attr('height', '4em')
        .attr('width', '310px')
        .select('text')
        .attr('font-size', '2.5em')
        .attr('font-weight', '700')
        .text(text_val.substring(0, text_progress));
      }
    }, 0.0000001);
  }


}
