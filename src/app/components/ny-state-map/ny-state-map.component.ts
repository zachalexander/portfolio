import {  Component, OnInit, ElementRef, ViewChild, ViewEncapsulation, Input, SimpleChanges, OnChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-ny-state-map',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './ny-state-map.component.html',
  styleUrls: ['./ny-state-map.component.sass']
})
export class NyStateMapComponent implements OnInit {

  @Input() private data: Array<any>;

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      this.drawMap(600, 600, this.data);
    }, 2000);
  }

  drawMap(width, height, datapull) {

    const margin = {top: 10, right: 10, bottom: 10, left: 10};

    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

    const projection = d3.geoMercator()
                        .center([-74.875366, 42.88])
                        .scale(3000)
                        .translate([(width / 2), (height / 2)]);

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
            .style('fill', '#ddd')
            .style('stroke', '#eee')
            .style('stroke-width', '1')
            .classed('svg-content-responsive', true);

          svg.selectAll('.maptext')
              .data([[-73.94, 40.7979]])
              .enter()
              .append('text')
              .attr('x', function (d) { console.log(projection(d)[0]); return projection(d)[0];})
              .attr('y', function (d) { console.log(projection(d)[1]); return projection(d)[1];})
              .attr('r', '4px')
              .attr('fill', 'rgba(238, 162, 154, 0.5)')
              .attr('stroke', 'rgba(238, 162, 154, 1')
              .attr('class', 'maptext')
              .text('test');
  }

}
