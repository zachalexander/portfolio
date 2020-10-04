import {  Component, OnInit, ElementRef, ViewChild, ViewEncapsulation, Input, SimpleChanges, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import * as nyMap from './../../../assets/northeastmap.json';
import * as countyMap from './../../../assets/us-counties.json';


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
        this.drawMap(len, 800, this.data);
      } else {
        this.drawMap(len, 1200, this.data);
      }
    }, 1000);
  }

  drawMap(width, height, datapull) {

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

    const map_projection = d3.geoMercator()
      .scale(1)
      .translate([0, 0]);

    const map_path = d3.geoPath()
      .projection(map_projection);
    
    const bounds = map_path.bounds(nyMap);

    const scale = 1 / Math.max( (bounds[1][0] - bounds[0][0]) / width, (bounds[1][1] - bounds[0][1]) / height);
    
    var translation = [
      (width - scale * (bounds[1][0] + bounds[0][0])) / 2,
      (height - scale * (bounds[1][1] + bounds[0][1])) / 2];

    const raster_width = (bounds[1][0] - bounds[0][0]) * scale;
    const raster_height = (bounds[1][1] - bounds[0][1]) * scale;

    const rtranslate_x = (width - raster_width) / 2;
    const rtranslate_y = (height - raster_height) / 2;
    
    const projection = d3.geoMercator()
                        .scale(scale)
                        .translate(translation);

    const path = d3.geoPath().projection(projection);

    const color = d3.scaleQuantile()
    .domain([0, 100, 400, 750, 1025, 2750])
    .range(['rgba(250, 228, 225, 0.7)', 'rgba(239, 160, 152, 0.7)', 'rgba(228, 93, 78, 0.7)', 'rgba(176, 42, 27, 0.7)', 'rgba(103, 25, 16, 0.7)']);

    const svg = d3.select('.ny_map')
                .append('svg')
                .attr('class', 'map')
                .attr('width',  width)
                .attr('height', height);

          svg.append("image")
          .attr('id', "raster")
          .attr("clip-path", "url(#northeast)")
          .attr("xlink:href", './../../../assets/northeast_optimized2.png')
          .attr("class", "raster")
          .attr('width', raster_width)
          .attr('height', raster_height)
          .attr('transform', 'translate(' + rtranslate_x + ', ' + rtranslate_y + ')');

          svg.selectAll('path')
            .data(datapull)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('id', 'unselected')
            .style('fill', function(d) {
              const value = d.properties.elevation;
                if (value) {
                  return color(d.properties.elevation);
                } else {
                  return color(0);
                }
            })
            .style('stroke', 'none')
            .style('opacity', '0.7')
            .style('stroke-width', '1')
            .classed('svg-content-responsive', true)


            // .call(function() {
            //   d3.select('#tooltip')
            //   .select('#value')
            //   .html(
            //     '<h5 class=' + 'tooltip_header' + '>' + '--- County' + '</h5>'
            //     + '<h5 class=' + 'tooltip_cases' + '>' + '--- confirmed cases ' + '</h5>');
            //   })
            // .on('mouseover', function(d) {
            //   svg.selectAll('path')
            //   .attr('d', path);
            //   d3.select(this).moveToFront()
            //   .style('cursor', 'crosshair')
            //   .style('stroke', '#333')
            //   .style('fill', 'darkred')
            //   .attr('id', 'pathSelection')
            //   .style('stroke-width', '4');
            //   d3.select('#tooltip')
            //   .style('left', 20 + 'px')
            //   .style('top', 0 + 'px')
            //   .html('<h5 class=' + 'tooltip_header' + '>' + d.properties.NAME + ' County' + '</h5>'
            //   + '<div class=' + 'tool_wrapper' + '>'
            //   + '<h5 class=' + 'tooltip_cases' + '>' + '<h5 class=' + 'case_highlight' + '>' + d.properties.elevation + '</h5>' 
            //   + ' confirmed cases ' + '</h5>'
            //   + '</div>'
            //   );
            //     // Show the tooltip
            //     d3.select('#tooltip').classed('hidden', false);
            //   })
            //   .on('mouseout', function() {
            //       d3.select('#tooltip').classed('hidden', true);
            //       svg.selectAll('path')
            //       .attr('d', path)
            //       d3.select(this).moveToBack()
            //       .style('stroke-width', '2')
            //       .style('stroke', '#555')
            //       .style('fill', '#fff');
            //   });



  //         svg.selectAll('path')
  //             .data(datapull)
  //             .enter()
  //             .append('text')
  //             .attr('x', function (d) {
  //               return path.centroid(d)[0] - 5;
  //             })
  //             .attr('y', function (d) {
  //                 return path.centroid(d)[1] + 2;
  //             })
  //             .attr('class', 'maptext')
  //             .attr('font-size', '.50em')
  //             .attr('font-weight', '700')
  //             .text(function(d) {
  //               if (d.properties.confirmed == null) {
  //                 return '';
  //               } else {
  //                 return d.properties.NAME;
  //               }
  //             });
  }

}
