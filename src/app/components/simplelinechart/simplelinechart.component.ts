import {  Component, OnInit, ElementRef, ViewChild, ViewEncapsulation, Input, SimpleChanges, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import * as jumboCases from '../../../assets/jumbotron.json';
import * as d3annotate from 'd3-svg-annotation';

@Component({
  selector: 'app-simplelinechart',
  templateUrl: './simplelinechart.component.html',
  styleUrls: ['./simplelinechart.component.scss']
})
export class SimplelinechartComponent implements OnInit {

  @Input() private data: Array<any>;
  currentCases;

  scrollable = d3.select("#test");

  constructor() { }

  ngOnInit() {
    const fakeData = jumboCases['fakedata'];
    this.scrollable;
    this.currentCases = fakeData[Object.keys(fakeData)[Object.keys(fakeData).length - 1]];
    const width = window.innerWidth;
    const height = document.getElementById('top').clientHeight;

    let yheight = 500;
    let annote = 15;
    let anote2 = 6;
    let anote3 = 1;

    if (width <= 600) {
      yheight = 400;
      annote = 13;
      anote2 = 6;
      anote3 = 1;
    }

    this.drawfakeCases(width, height, this.data, this.currentCases, yheight, annote, anote2, anote3);
  }

  drawfakeCases(width, height, datapull, cases, yheight, annotation, anote2, anote3) {

    // Add annotation to the chart

    datapull = datapull.fakedata;

    const parseTime = d3.timeParse('%m/%d/%Y');

    const x = d3.scaleTime().range([0, width]);
    x.domain(d3.extent(datapull, function(d) { return parseTime(d.date); }));

    const y = d3.scaleLinear().range([0, yheight]);
    y.domain([0, d3.max(datapull, function(d) { return d.cases; })]);

    const area = d3.area()
    .x(function(d) { return x(parseTime(d.date)); })
    .y0(height)
    .y1(function(d) { return height - y(d.cases); })
    .curve(d3.curveMonotoneX);

    const valueline = d3.line()
    .x(function(d) { return x(parseTime(d.date)); })
    .y(function(d) { return height - y(d.cases); })
    .curve(d3.curveMonotoneX);

    const svg = d3.select('.top-wrapper').append('svg')
                .attr('width',  width)
                .attr('height', height)
                .attr('x', 0)
                .attr('y', 0)
                .attr('class', 'jumbo')
                .append('g')
                .attr('transform', 'translate(0, 0)')
                .append('svg')
                .attr('id', 'annotate')
                .attr('width', width)
                .attr('height', height)
                .append('a');
                

          svg.append('path')
              .datum(datapull)
              .attr('class', 'area')
              .attr('fill', 'rgb(221, 221, 221, 0.3)')
              .attr('d', area);

    const path = svg.append('path')
                    .datum(datapull) // 10. Binds data to the line
                    .attr('class', 'line') // Assign a class for styling
                    .attr('fill', 'none')
                    .attr('stroke-width', '3px')
                    .attr('stroke', '#ddd')
                    .attr('d', valueline);


    const totalLength = path.node().getTotalLength();

        path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .on("start", function repeat() {
            d3.active(this)
                .duration(7000)
                .ease(d3.easeLinear)
                .attr('stroke-dashoffset', 0);
        });

  }

}

