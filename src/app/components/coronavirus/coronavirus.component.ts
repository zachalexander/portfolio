import { SocketService } from './../../services/socket.service';
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
  arrTweets;
  recentTweet;
  subscription$;
  cords = [];
  cordsRecent = [];
  virusCounts: Observable<VirusCounts[]>;
  nyLatest;
  virusLastUpdate;
  nyStateMap;
  nyData;
  dates;
  test;

  constructor(
    private djangoService: DjangoService,
    private spinner: NgxSpinnerService,
    private socketService: SocketService
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
    this.loadTwitterData();
    this.spinner.show();
    this.addValuesModel();
    this.loadVirusData();

    this.test = this.socketService.getTweets()

    this.test.subscribe(data => {
      console.log(data);
    })


    setTimeout(() => {
      this.loadTwitterData();
      this.drawMap(1000, 600, this.addValuesModel());
      this.drawNYState(400, 200, this.loadVirusData());
    }, 2000);

    // this.subscription$ = interval(20000).subscribe(data => {
    //   this.loadTwitterData();
    //   this.drawMap(1000, 600, this.addValuesModel());
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

  loadVirusData() {
    this.virusCounts = this.djangoService.getVirusCounts();

    this.virusCounts.subscribe(data => {
      this.virusLastUpdate = data['confirmed'].last_updated;
      const virusdata = data['confirmed'];
      virusdata['locations'].map(cases => {
        if (cases.country === 'US' && cases.province === 'New York') {
          this.nyLatest = cases.latest;
          this.nyData = cases;
          console.log(this.nyData);
        }
      });
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

  drawNYState(width, height, datapull) {


    const dateiso = datapull.history;
    console.log(dateiso);

    const yesterday = this.findYesterday();
    const yesterdayCases = dateiso[yesterday];

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
      }
    ];


    const latestData = this.dates[Object.keys(this.dates)[Object.keys(this.dates).length - 1]].date;

    if (latestData.toString() !== yesterday_format.toString()) {
      this.dates.push(
        {
          date: yesterday_format,
          cases: yesterdayCases
        }
      );
    } else {
      console.log('date updated!');
    }

    // console.log(this.dates);

    const margin = {top: 50, right: 20, bottom: 60, left: 90},
    width_new = width - margin.left - margin.right,
    height_new = width - margin.top - margin.bottom;

    const svg = d3.select('.nygraphic').append('svg')
                .attr('width',  width_new + 300)
                .attr('height', height_new)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const x = d3.scaleTime().range([0, width]);
    x.domain(d3.extent(this.dates, function(d) { return d.date; }));

    const y = d3.scaleLinear().range([0, height]);
    y.domain([d3.max(this.dates, function(d) { return d.cases + 50; }), 0]);


    const valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.cases); })
    .curve(d3.curveMonotoneX);

    const xAxis_woy = d3.axisBottom(x)
                        .ticks(0)
                        .tickFormat(d3.timeFormat('%m/%d'))
                        .tickValues(this.dates.map(d => d.date));

    svg.append('path')
        .datum(this.dates) // 10. Binds data to the line
        .attr('class', 'line') // Assign a class for styling
        .attr('fill', 'none')
        .attr('stroke-width', '1.5px')
        .attr('stroke', 'darkred')
        .attr('d', valueline); // 11. Calls the line generator

    const node = svg.selectAll('g')
                    .data(this.dates)
                    .enter()
                    .append('g');

    svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x).ticks(4).tickFormat(d3.timeFormat('%B %d')));

    // svg.append('g')
    //         .attr('class', 'y axis')
    //         .call(d3.axisLeft(y)); // Create an axis component with d3.axisLeft



  node.append('circle') // Uses the enter().append() method
      .attr('class', 'dot') // Assign a class for styling
      .attr('stroke', 'darkred')
      .attr('fill', '#ddd')
      .attr('cx', function(d, i) { return x(d.date); })
      .attr('cy', function(d) { return y(d.cases); })
      .attr('r', 3);

  node.append('text')
      .attr('class', 'labels')
      .attr('x', function(d) { return x(d.date); })
      .attr('y', function(d) { return y(d.cases) + 5; })
      .attr('text', function(d) { return d.cases; });

  }

drawMap(width, height, datapull) {

  // this.tweets.subscribe(data => {
  //   this.arrTweets = data;

  //   this.tweetrecent.subscribe(datarecent => {
  //     this.recentTweet = datarecent;
  //   });

  d3.select('svg').remove();

    const margin = {top: 10, right: 20, bottom: 10, left: 20};

    width = 1000 - margin.left - margin.right;
    height = 600 - margin.top - margin.bottom;

    const projection = d3.geoAlbersUsa();

    const path = d3.geoPath()
              .projection(projection);

    const svg = d3.select('.graphic')
                .append('svg')
                .attr('class', 'map')
                .attr('x', 0)
                .attr('y', 0)
                .attr('viewBox', '0 0 1000 600')
                .attr('preserveAspectRatio', 'xMidYMid');

    svg.selectAll('path')
      .data(datapull)
      .enter()
      .append('path')
      .attr('d', path)
      .style('fill', '#ddd')
      .style('stroke', '#eee')
      .style('stroke-width', '1')
      .classed('svg-content-responsive', true);

    // this.cords = this.arrTweets.map((coords) => {
    //   const justCoords = (
    //     {
    //       latitude: parseFloat(coords.coordinates_lat),
    //       longitude: parseFloat(coords.coordinates_lon)
    //     }
    //   );
    //   return justCoords;
    // });

    // this.cordsRecent = this.recentTweet.map((coords) => {
    //   const justCoordsRecent = (
    //     {
    //       latitude: parseFloat(coords.coordinates_lat),
    //       longitude: parseFloat(coords.coordinates_lon)
    //     }
    //   );
    //   return justCoordsRecent;
    // });

    // console.log(this.cordsRecent);

    // // add circles to svg
    // svg.selectAll('.old.points')
    //   .data(this.cords).enter()
    //   .append('circle')
    //   .attr('cx', function (d) {
    //     if (projection([d.latitude, d.longitude]) == null) {
    //       return projection([0, 0]);
    //     } else {
    //       return projection([d.latitude, d.longitude])[0];
    //     }
    //   })
    //   .attr('cy', function (d) {
    //     if (projection([d.latitude, d.longitude]) == null) {
    //       return projection([0, 0]);
    //     } else {
    //       return projection([d.latitude, d.longitude])[1];
    //     }
    //   })
    //   .attr('r', '4px')
    //   .attr('fill', 'rgba(238, 162, 154, 0.5)')
    //   .attr('stroke', 'rgba(238, 162, 154, 1')
    //   .attr('class', 'old points');

    //     // add circles to svg
    // svg.selectAll('.most.recentpoint')
    //   .data(this.cordsRecent).enter()
    //   .append('circle')
    //   .attr('cx', function (d) { return projection([d.latitude, d.longitude])[0]; })
    //   .attr('cy', function (d) { return projection([d.latitude, d.longitude])[1]; })
    //   .attr('r', '6px')
    //   .attr('fill', '#C70039')
    //   .attr('stroke', '#333')
    //   .transition()
    //   .duration(500)
    //   .attr('r', '8px')
    //   .transition()
    //   .duration(500)
    //   .attr('r', '6px')
    //   .attr('class', 'most recentpoint');
    // });
  }
}
