import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { Observable } from 'rxjs';
import { User } from '../../models/users';
import { DjangoService } from '../../services/django.service';
import * as jumboCases from '../../../assets/jumbotron.json';
import * as jumboCasesBar from '../../../assets/jumbotronbar.json';
import * as d3annotate from 'd3-svg-annotation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  showDiv = false;
  users: Observable<User[]>;
  fakecases = jumboCases['fakedata'];
  fakecasesbar;
  height;
  width;
  yheight;
  annote;
  anote2;
  anote3;


  constructor(private djangoService: DjangoService) { }

  ngOnInit() {

    this.width = window.innerWidth;
    this.height = document.getElementById('top').clientHeight;

    this.yheight = 500;
    this.annote = 15;
    this.anote2 = 6;
    this.anote3 = 1;

    if (this.width <= 600) {
      this.yheight = 400;
      this.annote = 13;
      this.anote2 = 6;
      this.anote3 = 1;
    }
    
    const text1 = 'Hello, welcome';
    this.typingAnimation(text1, '.line1');
    this.drawJumbo();
    this.drawJumboBar();

    const text3 = '';
    this.typingAnimation(text3, '.line3');

    setTimeout(() => {
      this.showDiv = true;
      const text2 = 'to my portfolio.';
      this.typingAnimation(text2, '.line2');
    }, 3400);
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({behavior:"smooth"});
  }

  showAnot() {
    this.fakecases = this.fakecases['fakedata'];

    d3.selectAll('text.annotation-note-title')
      .attr('x', 25)
      .attr('dy', 25);

    const parseTime = d3.timeParse('%m/%d/%Y');

    const x = d3.scaleTime().range([0, this.width]);
    x.domain(d3.extent(this.fakecases, function(d) { return parseTime(d.date); }));

    const y = d3.scaleLinear().range([0, this.yheight]);
    y.domain([0, d3.max(this.fakecases, function(d) { return d.cases; })]);
    
    const annotations = [
      {
        note: {
          title: 'My Projects'
        },
        type: d3annotate.annotationCalloutCircle,
        subject: {
          radius: 5,         // circle radius
          radiusPadding: 0  // white space around circle befor connector
        },
        className: 'myviz',
        color: ['#dddddd'],
        x: x(parseTime(this.fakecases[this.anote2].date)),
        y: this.height - y(this.fakecases[this.anote2].cases),
        align: 'middle',
        dy: 20,
        dx: 20
      },
      {
        note: {
          title: 'Grad School'
        },
        type: d3annotate.annotationCalloutCircle,
        subject: {
          radius: 5,         // circle radius
          radiusPadding: 0
        },
        className: 'mywork',
        color: ['#dddddd'],
        x: x(parseTime(this.fakecases[this.annote].date)),
        y: this.height - y(this.fakecases[this.annote].cases),
        dy: 20,
        dx: 20
      },
      {
        note: {
          title: 'Medium Feed'
        },
        type: d3annotate.annotationCalloutCircle,
        subject: {
          radius: 5,         // circle radius
          radiusPadding: 0
        },
        className: 'mediumposts',
        color: ['#dddddd'],
        x: x(parseTime(this.fakecases[this.anote3].date)),
        y: this.height - y(this.fakecases[this.anote3].cases),
        dy: 20,
        dx: 20
      }
    ]

  const makeAnnotations = d3annotate.annotation()
  .annotations(annotations);

    d3.select('#annotate')
    .append('g')
    .attr('class', 'annotation-group')
    .call(makeAnnotations);

    d3.select('.myviz')
    .on('click', function() {
      function scrollTween(offset) {
        return function() {
          var i = d3.interpolateNumber(window.pageYOffset || document.documentElement.scrollTop, offset);
          return function(t) { 
            if(t <= 0.15) {
              scrollTo(0, i(t));
            }
          };
        };
      }
      d3.transition()
      .duration(7500)
      .tween("scroll", scrollTween(document.body.getBoundingClientRect().height - window.innerHeight));  
    });

  d3.select('.mywork')
    .on('click', function() {
      function scrollTween(offset) {
        return function() {
          var i = d3.interpolateNumber(window.pageYOffset || document.documentElement.scrollTop, offset);
          return function(t) { 
            if(t <= 0.95) {
              scrollTo(0, i(t));
            }
          };
        };
    };

    d3.transition()
    .duration(7500)
    .tween("scroll", scrollTween(document.body.getBoundingClientRect().height - window.innerHeight));
  }); 

  d3.select('.mediumposts')
    .on('click', function() {
      function scrollTween(offset) {
        return function() {
          var i = d3.interpolateNumber(window.pageYOffset || document.documentElement.scrollTop, offset);
          return function(t) { 
            if(t <= 0.70) {
              scrollTo(0, i(t));
            }
          };
        };
    };

    d3.transition()
    .duration(7500)
    .tween("scroll", scrollTween(document.body.getBoundingClientRect().height - window.innerHeight));
    }); 
  }

  drawJumbo() {
    this.fakecases = jumboCases;
  }

  drawJumboBar() {
    this.fakecasesbar = jumboCasesBar;
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
