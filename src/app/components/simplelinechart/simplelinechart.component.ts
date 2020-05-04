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

  constructor() { }

  ngOnInit() {
    const fakeData = jumboCases['fakedata'];
    this.currentCases = fakeData[Object.keys(fakeData)[Object.keys(fakeData).length - 1]];
    const width = window.innerWidth;
    const height = window.innerHeight;

    let yheight = 100;
    let annote = 10;
    let anote2 = 2;

    if (width <= 600) {
      yheight = 300;
      annote = 12;
      anote2 = 3;
    }
    this.drawfakeCases(width, height, this.data, this.currentCases, yheight, annote, anote2);
  }

  drawfakeCases(width, height, datapull, cases, yheight, annotation, anote2) {

    // Add annotation to the chart

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
                .attr('transform', 'translate(0, 0)')
                .append('svg')
                .attr('id', 'annotate')
                .attr('width', width)
                .attr('height', height)
                .append('a');
                

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
        
    const annotations = [
      {
        note: {
          title: 'See my d3.js visualizations'
        },
        type: d3annotate.annotationCalloutCircle,
        subject: {
          radius: 15,         // circle radius
          radiusPadding: 0  // white space around circle befor connector
        },
        className: 'myviz',
        color: ['#182848'],
        x: x(parseTime(datapull[anote2].date)),
        y: y(datapull[anote2].cases),
        dy: 100,
        dx: 100
      },
      {
        note: {
          title: 'Read about my work'
        },
        type: d3annotate.annotationCalloutCircle,
        subject: {
          radius: 15,         // circle radius
          radiusPadding: 0
        },
        className: 'mywork',
        color: ['#182848'],
        x: x(parseTime(datapull[annotation].date)),
        y: y(datapull[annotation].cases),
        dy: -100,
        dx: -100
      }
    ]

        const makeAnnotations = d3annotate.annotation()
        .annotations(annotations);

          d3.select('#annotate')
          .append('g')
          .attr('class', 'annotation-group')
          .call(makeAnnotations);

        d3.select('.myviz')
          .on('click', function(){
            console.log('test1')
        });

        d3.select('.mywork')
          .on('click', function(){console.log('test2')});

  }

}
