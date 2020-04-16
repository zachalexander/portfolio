import { DjangoService } from './../../services/django.service';
import { Component, OnInit} from '@angular/core';
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


@Component({
  selector: 'app-coronavirus',
  templateUrl: './coronavirus.component.html',
  styleUrls: ['./coronavirus.component.scss']
})
export class CoronavirusComponent implements OnInit {

  tweets: Observable<Tweets[]>;
  tweetcount: Observable<TweetCount[]>;
  tweetrecent: Observable<Tweets[]>;
  virusCounts: Observable<VirusCounts[]>;
  dates;
  nyStateMap: Array<any>;
  nyCityMap: Array<any>;
  arrTweets;
  recentTweet;
  subscription$;
  cords = [];
  cordsRecent = [];
  nyLatest;
  virusLastUpdate;
  nyData: Array<any>;
  latestDonationCount;
  random;
  tweet;
  user;
  url;

  constructor(
    private djangoService: DjangoService,
    private pusherService: PusherService,
    private spinner: NgxSpinnerService
  ) { }

  addValuesModel() {
    const stateDataset = stateData['default'];
    return stateDataset.features;
  }

  addNYStateModel() {
    const nyStateDataset = nystateData['features'];
    return nyStateDataset;
  }

  addNYCityModel() {
    const nyCityDataset = nycityData['features'];
    return nycityData;
  }

  ngOnInit() {
    // this.loadTwitterData();
    this.spinner.show();
    this.loadVirusData();
    this.drawNYCases();
    this.sumDonations();

    this.nyCityMap = this.addNYCityModel()['features'];

    const tweetCount = this.djangoService.getTweetCount();
    const tweetData = this.djangoService.getFirstTweet();

    tweetCount.subscribe(data => {
      this.random = data[0].count;
    })

    tweetData.subscribe(data => {
      this.tweet = data[0].tweetText;
      this.user = data[0].user;
    })

    this.pusherService.subScribeToChannel('my-channel', ['tweetcount'], (data) => {
      this.random = data.number;
      console.log(data);
    });

    this.pusherService.subScribeToChannel('my-channel', ['tweetdetails'], (data) => {
      this.tweet = data.tweet;
      this.user = data.user;
      console.log(data);
    });

    this.pusherService.subScribeToChannel('my-channel', ['videodetails'], (data) => {
      console.log(data);
      this.url = data.includes.media[0].preview_image_url;
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

    setTimeout(() => {
      this.spinner.hide();
    }, 3000);
  }

  sumDonations () {
    const sum = [];
    nycDonation['food_bank'].map(donations => {
      sum.push(donations.amount);
    });
    this.latestDonationCount = sum.reduce((a, b) => a + b, 0);
  }

  loadTwitterData() {
    this.tweets = this.djangoService.getAllTweets();
    this.tweetrecent = this.djangoService.getFirstTweet();
    this.tweetcount = this.djangoService.getTweetCount();
  }

  loadVirusData() {
    this.virusCounts = this.djangoService.getVirusCounts();
    this.virusCounts.subscribe(data => {
      this.virusLastUpdate = data['locations'][0].last_updated;
      const sumCases = [];
      const nyCases = [];
       data['locations'].map(cases => {
        if (cases.province === 'New York') {
          sumCases.push(cases.latest.confirmed);
          nyCases.push(cases);
          this.nyData = nyCases;
          this.nyStateMap = this.addNYStateModel();
        }
      });

      this.nyStateMap.map(polygons => {
        this.nyData.map(cases => {
          if(polygons.properties.NAME === cases.county){
            polygons.properties['latitude'] = parseFloat(cases['coordinates'].latitude);
            polygons.properties['longitude'] = parseFloat(cases['coordinates'].longitude);
            polygons.properties['confirmed'] = parseInt(cases['latest'].confirmed);
          }
        })
      })
      this.nyLatest = sumCases.reduce((a, b) => a + b, 0);
    });
    return this.nyData;
  }

  findYesterday() {
    const today = new Date().toLocaleDateString();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yestMonth = yesterday.getMonth() + 1;
    yestMonth.toString();
    const yestYear = yesterday.getFullYear().toString().substring(2);
    const yestDay = yesterday.getDate();
    const yesterday_fnl = yestMonth + '/' + yestDay + '/' + yestYear;
    yesterday_fnl.toString();
    return yesterday_fnl;
  }

  drawNYCases() {
    this.dates = nycCasesData;
  }

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

ngAfterViewInit(): void {
  // @ts-ignore
  twttr.widgets.load();
}
}
