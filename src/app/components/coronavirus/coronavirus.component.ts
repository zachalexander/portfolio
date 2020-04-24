import { DjangoService } from './../../services/django.service';
import {  Component, OnInit, ElementRef, ViewChild, ViewEncapsulation, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';
import { Tweets } from '../../models/tweets';
import { TweetCount } from '../../models/tweetcount';
import { VirusCounts } from '../../models/viruscounts';
import { NgxSpinnerService } from 'ngx-spinner';
import * as stateData from '../../../assets/us-states.json';
import * as nystateData from '../../../assets/newyorkstate.json';
import { Observable, interval } from 'rxjs';
import * as nycCasesData from '../../../assets/nyccases.json';
import * as nycDonation from '../../../assets/donations.json';
import * as nycityData from '../../../assets/new-york-city-boroughs.json';
import { PusherService } from '../../services/pusher.service';
import { DomSanitizer } from '@angular/platform-browser';
import VideoInterface from '../../interfaces/video.interface';
import * as d3 from 'd3';

@Component({
  selector: 'app-coronavirus',
  templateUrl: './coronavirus.component.html',
  styleUrls: ['./coronavirus.component.scss']
})
export class CoronavirusComponent implements OnInit {

  private twitter: any;

  tweets: Observable<Tweets[]>;
  tweetcount: Observable<TweetCount[]>;
  tweetrecent: Observable<Tweets[]>;
  virusCounts: Observable<VirusCounts[]>;
  dates;
  nyStateMap: Array<any>;
  nyCityMap: Array<any>;
  videolinks: VideoInterface[] = [];
  arrTweets;
  recentTweet;
  subscription$;
  cords = [];
  cordsRecent = [];
  nyLatest;
  virusLastUpdate;
  nyData: Array<any>;
  latestDonationCount;
  updatecount;
  tweet;
  user;
  url;
  safeURL;
  updatedisplay;
  update = false;
  flash = false;
  colorchange = false;
  pages;
  pagenumbers = [];
  pagesten = [];
  pageLinks = [];
  clickedLI;
  elevenormore;
  firstvalue = true;
  twitterurl;
  closebanner;

  isLoading = false;
  loadedAll = false;
  isFirstLoad = true;

  boxarray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

  constructor(
    private djangoService: DjangoService,
    private pusherService: PusherService,
    private spinner: NgxSpinnerService,
    public sanitizer: DomSanitizer
  ) { }

  // addValuesModel() {
  //   const stateDataset = stateData['default'];
  //   return stateDataset.features;
  // }

  // addNYStateModel() {
  //   const nyStateDataset = nystateData['features'];
  //   return nyStateDataset;
  // }

  // addNYCityModel() {
  //   const nyCityDataset = nycityData['features'];
  //   return nycityData;
  // }

  ngOnInit() {
    this.showTwitterVideos();
    this.pagination();

    setTimeout(() => {
      this.clickedLI = document.getElementById('page_num_1').parentElement;
      this.clickedLI.classList.add('active');
      this.clickedLI.classList.remove('waves-effect');
    }, 1000);

    this.updatecount = [{
      count: 0
    }];

    // this.nyCityMap = this.addNYCityModel()['features'];

    this.pusherService.subScribeToChannel('my-channel', ['tweetcount'], (data) => {
      this.update = true;
      this.flash = true;
      this.updatecount.map(count => {
        count.count = count.count + 1;
      })
      this.updatedisplay = this.updatecount[0].count;
      setTimeout(() => {
        this.colorchange = true;
      }, 2000);
      this.colorchange = false;
    });

    // this.pusherService.subScribeToChannel('my-channel', ['tweetdetails'], (data) => {
    //   this.tweet = data.tweet;
    //   this.user = data.user;
    //   console.log(data);
    // });

    this.pusherService.subScribeToChannel('my-channel', ['videodetails'], (data) => {
      this.url = data;
      this.safeURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    });


    // setTimeout(() => {
    //   // this.loadTwitterData();
    //   // this.nyStateMap = this.addNYStateModel();
    //   // this.drawMap(1000, 600, this.addValuesModel());
    // }, 1000);



    // this.subscription$ = interval(20000).subscribe(data => {
    //   // this.loadTwitterData();
    //   this.loadVirusData();
    //   // this.drawMap(1000, 600, this.addValuesModel());
    // });
  }

  // sumDonations () {
  //   const sum = [];
  //   nycDonation['food_bank'].map(donations => {
  //     sum.push(donations.amount);
  //   });
  //   this.latestDonationCount = sum.reduce((a, b) => a + b, 0);
  // }

  // loadTwitterData() {

  //   this.tweets = this.djangoService.getAllTweets();
  // //   // this.tweetrecent = this.djangoService.getFirstTweet();
  // //   // this.tweetcount = this.djangoService.getTweetCount();
  // }

  // changePage() {
  //   this.djangoService.getPageTweets().subscribe(res => {

  //   })
  // }

  showTwitterVideos(): void {
    this.djangoService.getAllTweets().subscribe(res => {
      this.videolinks.push(...res);
      this.videolinks.map(links => {
        links.linkSafe = this.sanitizer.bypassSecurityTrustResourceUrl(links.tweetId);
        links.twitterurl = 'https://www.twitter.com/' + links.username;
      });
    })
    console.log(this.videolinks);
  }

  closeBanner(value) {
    this.closebanner = document.getElementById("overlay_num_" + value);
    this.closebanner.classList.add('hide');
  }

  pagination(): void {
    this.djangoService.getFullTweets().subscribe(res => {
      this.pages = res.length;
      if ((this.pages / 16) <= 1) {
        this.pages = 1;
      } else {
        this.pages = Math.floor(this.pages / 16) + 1;
      }
      this.pagenumbers = Array.from(Array(this.pages).keys()).map(x => x + 1);
      if (this.pagenumbers.length > 10) {
        this.elevenormore = true;
        this.pagesten = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      } else {
        this.elevenormore = false;
        this.pagesten = this.pagenumbers;
      }
    });
  }

  cyclePageUp() {
    this.firstvalue = false;
    this.pagesten.shift();
    const last_item = (this.pagesten.slice(-1).pop());
    const page_num_length = this.pagenumbers.slice(-1).pop();
    const final_item = last_item + 1;

    if (page_num_length === final_item) {
      this.elevenormore = false;
    }
    this.pagesten.push(last_item + 1);
  }

  cyclePageDown() {
    this.firstvalue = false;
    this.pagesten.pop();
    let first_value = this.pagesten.slice(0, 1).shift();
    first_value = first_value - 1;
    console.log(first_value);
    this.pagesten.unshift(first_value);

    if (first_value === 1) {
      this.firstvalue = true;
    }

  }

  getPageNumber(x) {
    return 'page_num_' + x;
  }

  getOverlayNum(x) {
    return 'overlay_num_' + x;
  }

  changePage(value) {
    this.clickedLI.classList.remove('active');
    this.clickedLI.classList.add('waves-effect');

    this.clickedLI = document.getElementById("page_num_" + value).parentElement;
    this.clickedLI.classList.add('active');
    this.clickedLI.classList.remove('waves-effect');

    this.djangoService.paginatePage(value).subscribe(res => {
      this.videolinks.length = 0;
      this.videolinks.splice(0, this.videolinks.length);
      this.videolinks.push(...res);
      this.videolinks.map(links => {
        links.linkSafe = this.sanitizer.bypassSecurityTrustResourceUrl(links.tweetId);
        links.twitterurl = 'https://www.twitter.com/' + links.username;
      });
    })
  }
  

  // loadVirusData() {
  //   this.virusCounts = this.djangoService.getVirusCounts();
  //   this.virusCounts.subscribe(data => {
  //     this.virusLastUpdate = data['locations'][0].last_updated;
  //     const sumCases = [];
  //     const nyCases = [];
  //      data['locations'].map(cases => {
  //       if (cases.province === 'New York') {
  //         sumCases.push(cases.latest.confirmed);
  //         nyCases.push(cases);
  //         this.nyData = nyCases;
  //         this.nyStateMap = this.addNYStateModel();
  //       }
  //     });

  //     this.nyStateMap.map(polygons => {
  //       this.nyData.map(cases => {
  //         if(polygons.properties.NAME === cases.county){
  //           polygons.properties['latitude'] = parseFloat(cases['coordinates'].latitude);
  //           polygons.properties['longitude'] = parseFloat(cases['coordinates'].longitude);
  //           polygons.properties['confirmed'] = parseInt(cases['latest'].confirmed);
  //         }
  //       })
  //     })
  //     this.nyLatest = sumCases.reduce((a, b) => a + b, 0);
  //   });
  //   return this.nyData;
  // }

  // findYesterday() {
  //   const today = new Date().toLocaleDateString();
  //   const yesterday = new Date(today);
  //   yesterday.setDate(yesterday.getDate() - 1);
  //   const yestMonth = yesterday.getMonth() + 1;
  //   yestMonth.toString();
  //   const yestYear = yesterday.getFullYear().toString().substring(2);
  //   const yestDay = yesterday.getDate();
  //   const yesterday_fnl = yestMonth + '/' + yestDay + '/' + yestYear;
  //   yesterday_fnl.toString();
  //   return yesterday_fnl;
  // }

  // drawNYCases() {
  //   this.dates = nycCasesData;
  // }

// drawMap(width, height, datapull) {

//   this.tweets.subscribe(data => {
//     this.arrTweets = data;

//     this.tweetrecent.subscribe(datarecent => {
//       this.recentTweet = datarecent;
//     });

//   d3.select('svg').remove();

//     const margin = {top: 10, right: 20, bottom: 10, left: 20};

//     width = 1000 - margin.left - margin.right;
//     height = 600 - margin.top - margin.bottom;

//     const projection = d3.geoAlbersUsa();

//     const path = d3.geoPath()
//               .projection(projection);

//     const svg = d3.select('.graphic')
//                 .append('svg')
//                 .attr('class', 'map')
//                 .attr('x', 0)
//                 .attr('y', 0)
//                 .attr('viewBox', '0 0 1000 600')
//                 .attr('preserveAspectRatio', 'xMidYMid');

//     svg.selectAll('path')
//       .data(datapull)
//       .enter()
//       .append('path')
//       .attr('d', path)
//       .style('fill', '#ddd')
//       .style('stroke', '#eee')
//       .style('stroke-width', '1')
//       .classed('svg-content-responsive', true);

//     this.cords = this.arrTweets.map((coords) => {
//       const justCoords = (
//         {
//           latitude: parseFloat(coords.coordinates_lat),
//           longitude: parseFloat(coords.coordinates_lon)
//         }
//       );
//       return justCoords;
//     });

//     this.cordsRecent = this.recentTweet.map((coords) => {
//       const justCoordsRecent = (
//         {
//           latitude: parseFloat(coords.coordinates_lat),
//           longitude: parseFloat(coords.coordinates_lon)
//         }
//       );
//       return justCoordsRecent;
//     });

//     console.log(this.cordsRecent);

//     // add circles to svg
//     svg.selectAll('.old.points')
//       .data(this.cords).enter()
//       .append('circle')
//       .attr('cx', function (d) {
//         if (projection([d.latitude, d.longitude]) == null) {
//           return projection([0, 0]);
//         } else {
//           return projection([d.latitude, d.longitude])[0];
//         }
//       })
//       .attr('cy', function (d) {
//         if (projection([d.latitude, d.longitude]) == null) {
//           return projection([0, 0]);
//         } else {
//           return projection([d.latitude, d.longitude])[1];
//         }
//       })
//       .attr('r', '4px')
//       .attr('fill', 'rgba(238, 162, 154, 0.5)')
//       .attr('stroke', 'rgba(238, 162, 154, 1')
//       .attr('class', 'old points');

//         // add circles to svg
//     svg.selectAll('.most.recentpoint')
//       .data(this.cordsRecent).enter()
//       .append('circle')
//       .attr('cx', function (d) { return projection([d.latitude, d.longitude])[0]; })
//       .attr('cy', function (d) { return projection([d.latitude, d.longitude])[1]; })
//       .attr('r', '6px')
//       .attr('fill', '#C70039')
//       .attr('stroke', '#333')
//       .transition()
//       .duration(500)
//       .attr('r', '8px')
//       .transition()
//       .duration(500)
//       .attr('r', '6px')
//       .attr('class', 'most recentpoint');
//     });
//   }

}
