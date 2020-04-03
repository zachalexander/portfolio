import {  Component, OnInit, ElementRef, ViewChild, ViewEncapsulation, Input, SimpleChanges, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import * as d3annotate from 'd3-svg-annotation';
import * as nycCasesData from '../../../assets/nyccases.json';

@Component({
  selector: 'app-ny-city-map',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './ny-city-map.component.html',
  styleUrls: ['./ny-city-map.component.scss']
})
export class NyCityMapComponent implements OnInit {

  constructor() { }

  @Input() private data: Array<any>;

  currentCases;
  yesterdayCases;

  ngOnInit() {
    const allNYC = nycCasesData['nyCases'];
    this.currentCases = allNYC[Object.keys(allNYC)[Object.keys(allNYC).length - 1]];
    this.yesterdayCases = allNYC[Object.keys(allNYC)[Object.keys(allNYC).length - 2]];

    setTimeout(() => {
      const len = window.innerWidth;
      if (len <= 600) {
        this.drawMap(len, 380, this.data, this.currentCases, this.yesterdayCases, 30000);
      } else {
        this.drawMap(600, 500, this.data, this.currentCases, this.yesterdayCases, 50000);
      }
    }, 1000);
  }


drawMap(width, height, datapull, cases, yesterdaycases, scale) {

  const margin = {top: 10, right: 10, bottom: 10, left: 10};

  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;

  const projection = d3.geoMercator()
                      .center([-74.0060, 40.7128])
                      .scale(scale)
                      .translate([(width / 2), (height / 2)]);

  const path = d3.geoPath()
            .projection(projection);

  const svg = d3.select('.nyc_map')
              .append('svg')
              .attr('class', 'map')
              .attr('width',  width)
              .attr('height', height)
              .append('svg')
              .attr('id', 'annotation')
              .attr('width', width)
              .attr('height', height);

        svg.selectAll('path')
          .data(datapull)
          .enter()
          .append('path')
          .attr('d', path)
          .attr('id', 'unselected')
          .style('fill', '#ddd')
          .style('stroke', '#999')
          .style('stroke-width', '1')
          .classed('svg-content-responsive', true);

        svg.selectAll('#mapcircle')
            .data([[-74.0060, 40.7128]])
            .enter()
            .append('circle')
            .attr('cx', function (d) {
              return projection(d)[0];
            })
            .attr('cy', function (d) {
                return projection(d)[1];
            })
            .attr('r', function() {
              return cases.cases / 400;
            })
            .attr('fill', 'rgba(238, 162, 154, 0.5)')
            .attr('stroke', 'rgba(238, 162, 154, 1')
            .attr('id', 'mapcircle');


        svg.selectAll('.maptext')
            .data([[-74.0060, 40.7128]])
            .enter()
            .append('text')
            .attr('x', function (d) {
              return projection(d)[0] - 30;
            })
            .attr('y', function (d) {
                return projection(d)[1];
            })
            .attr('class', 'maptext')
            .attr('font-size', '1.5em')
            .attr('font-weight', '700')
            .attr('fill', 'darkred')
            .text(function() {
                return cases.cases.toLocaleString('en-US');
            });

            const parseTime = d3.timeParse('%m/%d/%Y');
            const formatTime = d3.timeFormat("%B %d, %Y");
            const latestDate = formatTime(parseTime(cases.date));
            const yesterdayDate = formatTime(parseTime(yesterdaycases.date));

          const annotations = [
            {
              note: {
                title: "Today, " + latestDate,
                label: cases.cases.toLocaleString('en-US') + ' confirmed cases'
              },
              type: d3annotate.annotationCalloutCircle,
              subject: {
                radius: cases.cases / 400,         // circle radius
                radiusPadding: 0  // white space around circle befor connector
              },
              color: ["darkred"],
              x: projection([-74.0060, 40.7128])[0],
              y: projection([-74.0060, 40.7128])[1],
              dy: 170,
              dx: 120
            },
            {
              note: {
                title: "Yesterday, " + yesterdayDate,
                label: yesterdaycases.cases.toLocaleString('en-US') + ' confirmed cases'
              },
              type: d3annotate.annotationCalloutCircle,
              subject: {
                radius: yesterdaycases.cases / 400,         // circle radius
                radiusPadding: 0  // white space around circle befor connector
              },
              color: ["#333"],
              x: projection([-74.0060, 40.7128])[0],
              y: projection([-74.0060, 40.7128])[1],
              dy: -150,
              dx: -20
            }
          ]

            
          // Add annotation to the chart
          const makeAnnotations = d3annotate.annotation()
          .annotations(annotations);

            d3.select("#annotation")
            .append("g")
            .call(makeAnnotations);

      }
  }

