import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { Observable } from 'rxjs';
import { User } from '../../models/users';
import { DjangoService } from '../../services/django.service';
import * as jumboCases from '../../../assets/jumbotron.json';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  showDiv = false;
  users: Observable<User[]>;
  fakecases;


  constructor(private djangoService: DjangoService) { }

  ngOnInit() {
    const text1 = 'Hello, welcome';
    this.typingAnimation(text1, '.line1');
    this.drawJumbo();

    setTimeout(() => {
      this.showDiv = true;
      const text2 = 'to my portfolio.';
      this.typingAnimation(text2, '.line2');
    }, 3400);
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({behavior:"smooth"});
  }

  drawJumbo() {
    this.fakecases = jumboCases;
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
    }, 0.000000001);
  }


}
