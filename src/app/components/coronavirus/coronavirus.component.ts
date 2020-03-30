import { DjangoService } from './../../services/django.service';
import { Component, OnInit} from '@angular/core';
import { Tweets } from '../../models/tweets';
import { TweetCount } from '../../models/tweetcount';
import { VirusCounts } from '../../models/viruscounts';
import { NgxSpinnerService } from 'ngx-spinner';
import * as d3 from 'd3';
import * as stateData from '../../../assets/us-states.json';
import * as nystateData from '../../../assets/newyorkstate.json';
import { Observable, interval } from 'rxjs';

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
  dates: Array<any>;
  nyStateMap: Array<any>;
  arrTweets;
  recentTweet;
  subscription$;
  cords = [];
  cordsRecent = [];
  nyLatest;
  virusLastUpdate;
  nyData;

  constructor(
    private djangoService: DjangoService,
    private spinner: NgxSpinnerService
  ) { }

  addValuesModel() {
    const stateDataset = stateData['default'];
    return stateDataset.features;
  }

  addNYStateModel() {
    const nyStateDataset = nystateData;
    return nyStateDataset['features'];
  }

  ngOnInit() {
    // this.loadTwitterData();
    this.spinner.show();
    // this.loadVirusData();
    this.nyStateMap = this.addNYStateModel();

    setTimeout(() => {
      // this.loadTwitterData();
      // this.loadVirusData();
      // this.drawMap(1000, 600, this.addValuesModel());
      this.drawNYCases();
    }, 2000);

    // this.subscription$ = interval(20000).subscribe(data => {
    //   // this.loadTwitterData();
    //   this.loadVirusData();
    //   // this.drawMap(1000, 600, this.addValuesModel());
    // });

    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
  }

  loadTwitterData() {
    this.tweets = this.djangoService.getAllTweets();
    this.tweetrecent = this.djangoService.getFirstTweet();
    this.tweetcount = this.djangoService.getTweetCount();
  }

  // loadVirusData() {
  //   this.virusCounts = this.djangoService.getVirusCounts();
  //   this.virusCounts.subscribe(data => {
  //     this.virusLastUpdate = data['locations'][0].last_updated;
  //     const sumCases = [];
  //      data['locations'].map(cases => {
  //       if (cases.state === 'New York') {
  //         sumCases.push(cases.latest.confirmed);
  //         this.nyData = cases;
  //       }
  //     });
  //     this.nyLatest = sumCases.reduce((a, b) => a + b, 0);
  //   });
  //   console.log(this.nyData);
  //   return this.nyData;
  // }

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

    const yesterday = this.findYesterday();
    const yesterday_format = new Date(yesterday);

    this.dates = [
      {
        date: new Date('03/1/2020'),
        cases: 1
      },
      {
        date: new Date('03/2/2020'),
        cases: 1
      },
      {
        date: new Date('03/3/2020'),
        cases: 2
      },
      {
        date: new Date('03/4/2020'),
        cases: 11
      },
      {
        date: new Date('03/5/2020'),
        cases: 22
      },
      {
        date: new Date('03/6/2020'),
        cases: 44
      },
      {
        date: new Date('03/7/2020'),
        cases: 89
      },
      {
        date: new Date('03/8/2020'),
        cases: 105
      },
      {
        date: new Date('03/9/2020'),
        cases: 142
      },
      {
        date: new Date('03/10/2020'),
        cases: 173
      },
      {
        date: new Date('03/10/2020'),
        cases: 173
      },
      {
        date: new Date('03/11/2020'),
        cases: 220
      },
      {
        date: new Date('03/12/2020'),
        cases: 328
      },
      {
        date: new Date('03/13/2020'),
        cases: 421
      },
      {
        date: new Date('03/14/2020'),
        cases: 525
      },
      {
        date: new Date('03/15/2020'),
        cases: 732
      },
      {
        date: new Date('03/16/2020'),
        cases: 967
      },
      {
        date: new Date('03/17/2020'),
        cases: 1706
      },
      {
        date: new Date('03/18/2020'),
        cases: 2495
      },
      {
        date: new Date('03/19/2020'),
        cases: 5365
      },
      {
        date: new Date('03/20/2020'),
        cases: 8310
      },
      {
        date: new Date('03/21/2020'),
        cases: 12000
      },
      {
        date: new Date('03/22/2020'),
        cases: 15900
      },
      {
        date: new Date('03/23/2020'),
        cases: 19000
      },
      {
        date: new Date('03/24/2020'),
        cases: 25944
      }
    ];

    const latestData = this.dates[Object.keys(this.dates)[Object.keys(this.dates).length - 1]].date;
    const secondLatestDataCases = this.dates[Object.keys(this.dates)[Object.keys(this.dates).length - 2]].cases;

    if (latestData.toString() !== yesterday_format.toString()) {
      this.dates.push(
        {
          date: yesterday_format,
          cases: secondLatestDataCases + (this.nyLatest - secondLatestDataCases)
        }
      );
    } else {
      console.log('date updated!');
    }
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
}
