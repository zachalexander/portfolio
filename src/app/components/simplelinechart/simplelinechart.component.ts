import {  Component, OnInit, ElementRef, ViewChild, ViewEncapsulation, Input, SimpleChanges, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import * as jumboCases from '../../../assets/jumbotron.json';

@Component({
  selector: 'app-simplelinechart',
  templateUrl: './simplelinechart.component.html',
  styleUrls: ['./simplelinechart.component.scss']
})
export class SimplelinechartComponent implements OnInit {

  @Input() private data: Array<any>;
  currentCases;

  constructor() { }

  ngOnInit() {
    const fakeData = jumboCases['fakedata'];
    this.currentCases = fakeData[Object.keys(fakeData)[Object.keys(fakeData).length - 1]];
    const width = window.innerWidth;
    const height = window.innerHeight;

    let yheight = 100;

    if (width <= 600) {
      yheight = 300;
    }
    this.drawfakeCases(width, height, this.data, this.currentCases, yheight);
  }

  drawfakeCases(width, height, datapull, cases, yheight) {

    datapull = datapull.fakedata;

    const parseTime = d3.timeParse('%m/%d/%Y');

    const x = d3.scaleTime().range([0, width]);
    x.domain(d3.extent(datapull, function(d) { return parseTime(d.date); }));

    const y = d3.scaleLinear().range([yheight, height]);
    y.domain([d3.max(datapull, function(d) { return d.cases; }), 0]);

    const area = d3.area()
    .x(function(d) { return x(parseTime(d.date)); })
    .y0(height)
    .y1(function(d) { return y(d.cases); })
    .curve(d3.curveMonotoneX);

    const valueline = d3.line()
    .x(function(d) { return x(parseTime(d.date)); })
    .y(function(d) { return y(d.cases); })
    .curve(d3.curveMonotoneX);

    const svg = d3.select('.top').append('svg')
                .attr('width',  width)
                .attr('height', height)
                .attr('x', 0)
                .attr('y', 0)
                .attr('class', 'jumbo')
                .append('g')
                .attr('transform', 'translate(0, 0)');

    svg.append('path')
        .datum(datapull)
        .attr('class', 'area')
        .attr('fill', 'rgba(75, 108, 183, 0.3)')
        .attr('d', area);

    const path = svg.append('path')
                    .datum(datapull) // 10. Binds data to the line
                    .attr('class', 'line') // Assign a class for styling
                    .attr('fill', 'none')
                    .attr('stroke-width', '3px')
                    .attr('stroke', '#182848')
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
