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
    this.loadTwitterData();
    this.spinner.show();
    this.addValuesModel();
    this.loadVirusData();

    setTimeout(() => {
      this.loadTwitterData();
      this.drawMap(1000, 600, this.addValuesModel());
      this.drawNYState(400, 400, this.loadVirusData());
    }, 2000);

    this.subscription$ = interval(20000).subscribe(data => {
      this.loadTwitterData();
      this.drawMap(1000, 600, this.addValuesModel());
    });

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
        }
      });
    });
    return this.nyData;
  }

  drawNYState(width, height, datapull) {


    const dateiso = datapull.history;
    console.log(dateiso);

    this.dates = [
      {
        date: new Date('03/10/2020'),
        cases: 173
      },
      {
        date: new Date('03/11/2020'),
        cases: 220
      },
      {
        date: new Date('03/10/2020'),
        cases: 328
      }
    ];

    console.log(this.dates);

    const margin = {top: 50, right: 20, bottom: 60, left: 90},
    width_new = width - margin.left - margin.right,
    height_new = width - margin.top - margin.bottom;

    const svg = d3.select('.nygraphic').append('svg')
                .attr('width',  width_new + margin.left + margin.right)
                .attr('height', height_new + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const x = d3.scaleTime().range([0, width]);
    x.domain(d3.extent(this.dates, function(d) { return d.date; }));

    const y = d3.scaleLinear().range([height, 0]);
    y.domain([d3.min(this.dates, function(d) { return d.cases; }) - 5, 100]);

    const valueline = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.cases);  })
        .curve(d3.curveMonotoneX);

    svg.append('path')
        .data(this.dates)
        .attr('class', 'line')
        .attr('d', valueline);


    const xAxis_woy = d3.axisBottom(x).tickFormat(d3.timeFormat('Week %V')).tickValues(this.dates.map(d => d.date));

    svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis_woy);

  }

drawMap(width, height, datapull) {

  this.tweets.subscribe(data => {
    this.arrTweets = data;

    this.tweetrecent.subscribe(datarecent => {
      this.recentTweet = datarecent;
    });

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

    this.cords = this.arrTweets.map((coords) => {
      const justCoords = (
        {
          latitude: parseFloat(coords.coordinates_lat),
          longitude: parseFloat(coords.coordinates_lon)
        }
      );
      return justCoords;
    });

    this.cordsRecent = this.recentTweet.map((coords) => {
      const justCoordsRecent = (
        {
          latitude: parseFloat(coords.coordinates_lat),
          longitude: parseFloat(coords.coordinates_lon)
        }
      );
      return justCoordsRecent;
    });

    console.log(this.cordsRecent);

    // add circles to svg
    svg.selectAll('.old.points')
      .data(this.cords).enter()
      .append('circle')
      .attr('cx', function (d) {
        if (projection([d.latitude, d.longitude]) == null) {
          return projection([0, 0]);
        } else {
          return projection([d.latitude, d.longitude])[0];
        }
      })
      .attr('cy', function (d) {
        if (projection([d.latitude, d.longitude]) == null) {
          return projection([0, 0]);
        } else {
          return projection([d.latitude, d.longitude])[1];
        }
      })
      .attr('r', '2px')
      .attr('fill', '#EEA29A')
      .attr('class', 'old points');

        // add circles to svg
    svg.selectAll('.most.recentpoint')
      .data(this.cordsRecent).enter()
      .append('circle')
      .attr('cx', function (d) { return projection([d.latitude, d.longitude])[0]; })
      .attr('cy', function (d) { return projection([d.latitude, d.longitude])[1]; })
      .attr('r', '4px')
      .attr('fill', '#C70039')
      .attr('stroke', '#333')
      .transition()
      .duration(500)
      .attr('r', '6px')
      .transition()
      .duration(500)
      .attr('r', '4px')
      .attr('class', 'most recentpoint');
    });
  }
}
