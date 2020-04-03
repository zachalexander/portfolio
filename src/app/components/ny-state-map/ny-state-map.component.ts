import {  Component, OnInit, ElementRef, ViewChild, ViewEncapsulation, Input, SimpleChanges, OnChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-ny-state-map',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './ny-state-map.component.html',
  styleUrls: ['./ny-state-map.component.scss']
})
export class NyStateMapComponent implements OnInit {

  @Input() private data: Array<any>;

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      const len = window.innerWidth;
      if (len <= 600) {
        this.drawMap(len, 380, this.data, 2500);
      } else {
        this.drawMap(600, 500, this.data, 4000);
      }
    }, 1000);
  }

  drawMap(width, height, datapull, scale) {

        // https://github.com/wbkd/d3-extended
        d3.selection.prototype.moveToFront = function() {
          return this.each(function(){
            this.parentNode.appendChild(this);
          });
        };

        d3.selection.prototype.moveToBack = function() {
          return this.each(function() { 
              var firstChild = this.parentNode.firstChild; 
              if (firstChild) { 
                  this.parentNode.insertBefore(this, firstChild); 
              } 
          });
      };

    const margin = {top: 10, right: 10, bottom: 10, left: 10};

    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;


    const projection = d3.geoMercator()
                        .center([-74.875366, 42.88])
                        .scale(scale)
                        .translate([((width / 2) + 60), (height / 2)]);

    const path = d3.geoPath()
              .projection(projection);

    const svg = d3.select('.ny_map')
                .append('svg')
                .attr('class', 'map')
                .attr('width',  width)
                .attr('height', height);

          svg.selectAll('path')
            .data(datapull)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('id', 'unselected')
            .style('fill', '#ddd')
            .style('stroke', '#eee')
            .style('stroke-width', '1')
            .classed('svg-content-responsive', true)
            .call(function() {
              d3.select('#tooltip')
              .select('#value')
              .html(
                '<h5 class=' + 'tooltip_header' + '>' + '--- County' + '</h5>'
                + '<h5 class=' + 'tooltip_cases' + '>' + '--- confirmed cases ' + '</h5>');
              })
            .on('mouseover', function(d) {
              svg.selectAll('path')
              .attr('d', path);
              d3.select(this).moveToFront()
              .style('cursor', 'crosshair')
              .style('stroke', '#333')
              .style('fill', 'darkred')
              .attr('id', 'pathSelection')
              .style('stroke-width', '2');
              d3.select('#tooltip')
              .style('left', 20 + 'px')
              .style('top', 0 + 'px')
              .html('<h5 class=' + 'tooltip_header' + '>' + d.properties.NAME + ' County' + '</h5>'
              + '<div class=' + 'tool_wrapper' + '>'
              + '<h5 class=' + 'tooltip_cases' + '>' + '<h5 class=' + 'case_highlight' + '>' + d.properties.confirmed.toLocaleString('en-US') + '</h5>' 
              + ' confirmed cases ' + '</h5>'
              + '</div>'
              );
                // Show the tooltip
                d3.select('#tooltip').classed('hidden', false);
              })
              .on('mouseout', function() {
                  d3.select('#tooltip').classed('hidden', true);
                  svg.selectAll('path')
                  .attr('d', path)
                  d3.select(this).moveToBack()
                  .style('stroke-width', '1')
                  .style('stroke', '#eee')
                  .style('fill', '#ddd');
              });

          svg.selectAll('.maptext')
              .data(datapull)
              .enter()
              .append('text')
              .attr('x', function (d) {
                if (d.properties.NAME === 'New York' || d.properties.NAME === 'Rockland') {
                  return path.centroid(d)[0] - 20;
                } else if (d.properties.NAME === 'Orange') {
                  return path.centroid(d)[0] - 10;
                } else {
                return path.centroid(d)[0] - 5;
                }
              })
              .attr('y', function (d) {
                  return path.centroid(d)[1] + 2;
              })
              .attr('class', 'maptext')
              .attr('font-size', '.50em')
              .attr('font-weight', '700')
              .attr('fill', function(d) {
                if (d.properties.confirmed >= 1000) {
                  return 'darkred';
                } else {
                  return '#333';
                }
              })
              .text(function(d) {
                if (d.properties.confirmed == null && (d.properties.NAME === 'Kings' ||
                d.properties.NAME === 'Queens' || d.properties.NAME === 'Bronx' ||
                d.properties.NAME === 'Richmond')) {
                  return '';
                } else if (d.properties.confirmed == null) {
                  return 0;
                } else {
                  return d.properties.confirmed.toLocaleString('en-US');
                }
              });
  }

}
