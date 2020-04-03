import {  Component, OnInit, ElementRef, ViewChild, ViewEncapsulation, Input, SimpleChanges, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import * as d3annotate from 'd3-svg-annotation';
import * as nycCasesData from '../../../assets/nyccases.json';

@Component({
  selector: 'app-line-area-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './line-area-chart.component.html',
  styleUrls: ['./line-area-chart.component.scss']
})
export class LineAreaChartComponent implements OnInit {

  @Input() private data: Array<any>;
  currentCases;

  constructor() { }

  ngOnInit() {
    const allNYC = nycCasesData['nyCases'];
    this.currentCases = allNYC[Object.keys(allNYC)[Object.keys(allNYC).length - 1]];
    this.drawNYCases(300, 200, this.data, this.currentCases);
  }

  drawNYCases(width, height, datapull, cases) {

    datapull = datapull.nyCases;

    const parseTime = d3.timeParse('%m/%d/%Y');
    const bisectDate = d3.bisector(function(d) { return parseTime(d.date); }).right;

    const margin = {top: 30, right: 5, bottom: 10, left: 0},
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
                .attr('width',  width_new + 120)
                .attr('height', height_new)
                .append('g')
                .attr('transform', 'translate(' + (margin.left  + 45) + ',' + margin.top + ')');

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
    
    svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%m/%d')).ticks(8).tickPadding(5));
   
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

        const xLatest = x(parseTime(cases.date));
        const yLatest = y(cases.cases);

    // 12. Appends a circle for each datapoint 
    svg.append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", xLatest)
        .attr("cy", yLatest)
        .attr("r", 4);

    const focus = svg.append("g")
    .attr("class", "focus")
    .style("display", "none");

    focus.append("circle")
        .attr("r", 4);

    focus.append("text")
        .attr("x", 10)
      	.attr("dy", ".31em");
        svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width_new + 100)
        .attr("height", height_new)
        .on("mouseover", function() { 
          focus.style("display", null);
        }).style('cursor', 'crosshair')
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
      const x0 = x.invert(d3.mouse(this)[0]),
          i = bisectDate(datapull, x0, 1),
          d0 = datapull[i - 1],
          d1 = datapull[i];
          let d = x0 - parseTime(d0.date) > parseTime(d1.date) - x0 ? d1 : d0;
      focus.attr("transform", "translate(" + x(parseTime(d.date)) + "," + y(d.cases) + ")");
      focus.select("text").text(function() { return d.cases.toLocaleString('en-US'); });
    }

  }
}
