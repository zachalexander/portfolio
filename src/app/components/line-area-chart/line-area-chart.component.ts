import {  Component, OnInit, ElementRef, ViewChild, ViewEncapsulation, Input, SimpleChanges, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import * as nycCasesData from '../../../assets/nyccases.json';

@Component({
  selector: 'app-line-area-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './line-area-chart.component.html',
  styleUrls: ['./line-area-chart.component.scss']
})
export class LineAreaChartComponent implements OnInit {

  @Input() private data: Array<any>;

  constructor() { }

  ngOnInit() {
    this.drawNYCases(300, 200, this.data);
  }

  drawNYCases(width, height, datapull) {

    console.log(datapull);

    datapull = datapull.nyCases;

    const parseTime = d3.timeParse('%m/%d/%Y');

    const margin = {top: 30, right: 5, bottom: 10, left: 35},
    width_new = width - margin.left - margin.right,
    height_new = width - margin.top - margin.bottom;

    const x = d3.scaleTime().range([0, width]);
    x.domain(d3.extent(datapull, function(d) { return parseTime(d.date); }));

    const y = d3.scaleLinear().range([0, height]);
    y.domain([d3.max(datapull, function(d) { return d.cases; }), 0]);

    const area = d3.area()
    .x(function(d) { return x(parseTime(d.date)); })
    .y0(height)
    .y1(function(d) { return y(d.cases); });

    const valueline = d3.line()
    .x(function(d) { return x(parseTime(d.date)); })
    .y(function(d) { return y(d.cases); })
    .curve(d3.curveMonotoneX);

    const svg = d3.select('.line_chart').append('svg')
                .attr('width',  width_new + 100)
                .attr('height', height_new)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // set the gradient
    svg.append('linearGradient')
        .attr('id', 'area-gradient')
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', 0)
        .attr('y1', y(0))
        .attr('x2', 0)
        .attr('y2', y(d3.max(datapull, function(d) { return d.cases + 50; })))
      .selectAll('stop')
        .data([
          {offset: '0%', color: 'rgba(238, 162, 154, 0)'},
          {offset: '100%', color: 'rgba(238, 162, 154, 1)'}
        ])
      .enter().append('stop')
        .attr('offset', function(d) { return d.offset; })
        .attr('stop-color', function(d) { return d.color; });


    // Container for the gradients
    const defs = svg.append('defs');

    // Filter for the outside glow
    const filter = defs.append('filter')
        .attr('id', 'glow');
    filter.append('feGaussianBlur')
        .attr('stdDeviation', '4.5')
        .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode')
        .attr('in', 'coloredBlur');
    feMerge.append('feMergeNode')
        .attr('in', 'SourceGraphic');

    svg.append('path')
        .datum(datapull)
        .attr('class', 'area')
        .attr('fill', 'rgba(238, 162, 154, 0.5)')
        .style('filter', 'url(#glow)')
        .attr('d', area);

    svg.append('path')
        .datum(datapull) // 10. Binds data to the line
        .attr('class', 'line') // Assign a class for styling
        .attr('fill', 'none')
        .attr('stroke-width', '3px')
        .attr('stroke', 'darkred')
        // .style('filter', 'url(#glow)')
        .attr('d', valueline); // 11. Calls the line generator

    svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%m/%d')).ticks(8).tickSize(0).tickPadding(15));

  }
}
