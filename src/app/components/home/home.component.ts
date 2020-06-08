import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { Observable } from 'rxjs';
import { User } from '../../models/users';
import { DjangoService } from '../../services/django.service';
import * as jumboCases from '../../../assets/jumbotron.json';
import * as jumboCasesBar from '../../../assets/jumbotronbar.json';
import * as d3annotate from 'd3-svg-annotation';
import * as AOS from 'aos';
import {GoogleAnalyticsService} from './../../services/google-analytics.service';


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
  anote4;
  mobile;


  constructor(
    private djangoService: DjangoService,
    private googleAnalyticsService: GoogleAnalyticsService
  ) { }

  ngOnInit() {

    AOS.init();

    this.width = window.innerWidth;
    this.height = document.getElementById('top').clientHeight;

    if (this.width >= 600) {
      this.mobile = false;
    } else {
      this.mobile = true;
    }

    this.yheight = 500;
    this.annote = 17;
    this.anote2 = 14;
    this.anote3 = 5;
    this.anote4 = 2;

    if (this.width <= 600) {
      this.yheight = 400;
      this.annote = 12;
      this.anote2 = 9;
    }

    this.drawJumbo();
    this.drawJumboBar();

  d3.select('.circle-background')
    .attr('height', 300)
    .attr('width', this.width)
    .append('defs')
      .append('pattern')
      .attr('id', 'image')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('height', 300)
      .attr('width', this.width)
        .append('image')
        .attr('id', 'image')
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', 300)
        .attr('width', this.width)
        .attr('xlink:href', '../../../assets/img/trump-regression.gif');

      d3.select('.circle-background').append('circle')
      .attr('id', 'top')
      .attr('cx', this.width / 2)
      .attr('cy', 150)
      .attr('r', 150)
      .attr('fill', 'url(#image)');


  d3.select('.circle-background-insiten')
  .attr('height', 300)
  .attr('width', this.width)
  .append('defs')
    .append('pattern')
    .attr('id', 'image-insiten')
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('height', 300)
    .attr('width', this.width)
      .append('image')
      .attr('id', 'image-insiten')
      .attr('x', 0)
      .attr('y', 0)
      .attr('height', 300)
      .attr('width', this.width)
      .attr('xlink:href', '../../../assets/img/insiten.gif');

    d3.select('.circle-background-insiten').append('circle')
    .attr('id', 'top')
    .attr('cx', this.width / 2)
    .attr('cy', 150)
    .attr('r', 150)
    .attr('fill', 'url(#image-insiten)');


  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({behavior: 'smooth'});
  }


  drawJumbo() {
    this.fakecases = jumboCases;
  }

  drawJumboBar() {
    this.fakecasesbar = jumboCasesBar;
  }

  resumeClick() {
    this
    .googleAnalyticsService
    .eventEmitter('resume_click', 'employer_interest', 'resume', 'click', 1);
  }

  regressionClick() {
    this
    .googleAnalyticsService
    .eventEmitter('regression_click', 'data_interest', 'regression', 'click', 1);
  }

  chessClick() {
    this
    .googleAnalyticsService
    .eventEmitter('chess_click', 'data_interest', 'chess', 'click', 1);
  }

  insitenClick() {
    this
    .googleAnalyticsService
    .eventEmitter('insiten_click', 'data_interest', 'insiten', 'click', 1);
  }

  rpubsClick() {
    this
    .googleAnalyticsService
    .eventEmitter('rpubs_click', 'employer_interest', 'rpubs', 'click', 1);
  }
}
