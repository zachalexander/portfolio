import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import * as jumboCases from '../../../assets/jumbotron.json';
import * as jumboCasesBar from '../../../assets/jumbotronbar.json';
import * as AOS from 'aos';
import {GoogleAnalyticsService} from './../../services/google-analytics.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  fakecases = jumboCases['fakedata'];
  fakecasesbar;
  height;
  width;
  mobile;


  constructor(
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

    this.drawJumbo();
    this.drawJumboBar();

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

  
  climateClick() {
    this
    .googleAnalyticsService
    .eventEmitter('climate_click', 'data_interest', 'climate', 'click', 1);
  }

  rpubsClick() {
    this
    .googleAnalyticsService
    .eventEmitter('rpubs_click', 'employer_interest', 'rpubs', 'click', 1);
  }
}
