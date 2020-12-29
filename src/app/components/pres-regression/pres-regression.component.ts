import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as stateData from '../../../assets/us-states.json';
import * as stateFeatures from '../../../assets/us-state-features.json';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-pres-regression',
  templateUrl: './pres-regression.component.html',
  styleUrls: ['./pres-regression.component.scss']
})
export class PresRegressionComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService) { }

  addValuesModel() {
    const stateDataset = stateData['default'];
    d3.csv('../../../assets/model_data.csv', function(data) {
      data.forEach(element => {
        const dataState = element.state;
        const dataVotes = element.model_three;
        const dataActual = element.trump_per;
        const dataDiff = element.diff_three;

        for (let i = 0; i < stateDataset.features.length; i++) {
          const jsonState = stateDataset.features[i].properties.name;

          if (dataState === jsonState) {
            stateDataset.features[i].properties['value'] = dataVotes;
            stateDataset.features[i].properties['actual'] = dataActual;
            stateDataset.features[i].properties['diff'] = dataDiff;

            if (stateDataset.features[i].properties['value'] === '') {
              stateDataset.features[i].properties['value'] = 'No model calculation';
            }
          }
        }
      });
    });

    stateDataset.features.map(data => {
      stateFeatures['default'].map(features => {
        if (data.properties.name === features.state) {
          data.properties.flag_image_url = '../../assets/img/flags/' + features.slug + '-small.png';
        }
      });
    });

    return stateDataset.features;

  }

  ngOnInit() {
    this.spinner.show();
    this.drawMap(800, 400, this.addValuesModel());

    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
  }

  drawMap(width, height, datapull) {

    let viewbox = 1400;
    viewbox.toString();
    if (window.innerWidth >= 800) {
      viewbox = 1000;
      viewbox.toString();
    }

    d3.select('svg').remove();
    setTimeout(() => {
      const margin = {top: 10, right: 80, bottom: 10, left: 80};

      width = width - margin.left - margin.right;
      height = height - margin.top - margin.bottom;


      const projection = d3.geoAlbersUsa();

      const path = d3.geoPath()
                .projection(projection);

      const ext_color_domain = [25, 35, 45, 55, 65];

      const color_domain = [25, 35, 45, 55, 65];

      const legend_labels = ['25% - 34%', '35% - 44%', '45% - 54%', '55% - 64%', '+65%'];

      const color_legend = d3.scaleQuantile<string>()
        .range(['#fae4e1', '#efa098', '#e45d4e', '#b02a1b', '#671910'])
        .domain(color_domain);

      const svg = d3.select('.graphic')
                  .append('svg')
                  .attr('class', 'map')
                  .attr('id', 'map')
                  .attr('x', 0)
                  .attr('y', 0)
                  .attr('viewBox', '0 0 1000 600')
                  .attr('preserveAspectRatio', 'xMidYMid');

      const legend = svg.selectAll('g')
        .data(ext_color_domain)
        .classed('legend', true)
        .enter().append('g')
        .attr('class', 'legend');

      const ls_w = 20, ls_h = 20;

      legend.append('rect')
        .attr('x', 820)
        .attr('y', function (d, i) { return (height - (i * ls_h) - 2 * ls_h) + 100; })
        .attr('width', ls_w)
        .attr('height', ls_h)
        .style('stroke', '#333')
        .style('stroke-width', '1')
        .style('fill', function (d, i) { return color_legend(d); })
        .style('opacity', 0.8);

      legend.append('text')
        .attr('x', 850)
        .attr('y', function (d, i) { return (height - (i * ls_h) - ls_h - 4) + 100; })
        .text(function (d, i) { return legend_labels[i]; });


      legend.append('text')
        .attr('x', 790)
        .attr('y', (height - (5.5 * ls_h) - ls_h - 4) + 100)
        .text('Percent for Trump (Actual)');

      const color = d3.scaleQuantile<string>()
                  .range(['#fae4e1', '#efa098', '#e45d4e', '#b02a1b', '#671910'])
                  .domain([25, 35, 45, 55, 65, 75]);

      svg.selectAll('path')
        .data(datapull)
        .enter()
        .append('path')
        .attr('d', path)
        .style('fill', function(d) {
          const value = d['Change_f'];
            if (value) {
              return color(d['Change_f']);
            } else {
              return '#ddd';
            }
        })
        .style('stroke', '#333')
        .style('stroke-width', '1')
        .classed('svg-content-responsive', true)
        .call(function() {
          d3.select('#tooltip')
          .style('left', 20 + 'px')
          .style('top', 0 + 'px')
          .select('#value')
          .html('<table class=' + 'table table-striped table-sm' + '>'
          + '<thead>'
            + '<tr>'
              + '<th scope=' + 'col' + '>' + '---' + '</th>'
              + '<th class=' + 'state_title ' + 'scope=' + 'col' + '>' + '---' + '</th>'
            + '</tr>'
          + '</thead>'
          + '<tbody>'
          + '<tr>'
            + '<td> <strong>' + 'Actual' + '</strong> </td>'
            + '<td> <strong>' + '---' + '%' + '</strong></td>'
          + '</tr>'
          + '<tr>'
            + '<td>' + 'Model' + '</td>'
            + '<td>' + '---' + '%' + '</td>'
          + '</tr>'
        + '</tbody>'
        + '</table>'
        + '<p class = ' + 'error_value' + '> Model Error (' + '---' + '%' + ')' + '</p>'
          );
        })
        .on('mouseover', function(d) {
          svg.selectAll('path')
          .attr('d', path)
          // tslint:disable-next-line:no-shadowed-variable
          .style('fill', function(d) {
            const value = d['properties'].actual;
              if (value) {
                return color(d['properties'].actual);
              } else if (this) {
                return color(value);
              } else {
                return '#ddd';
              }
          })
          .style('opacity', '0.2');

          d3.select(this)
          .style('cursor', 'crosshair')
          .style('stroke', '#333')
          .style('fill', function(d) {
            const value = d['properties'].actual;
              if (value) {
                return color(d['properties'].actual);
              } else {
                return '#ddd';
              }
          })
          .style('opacity', '1')
          .style('stroke-width', '4');

          d3.select('#tooltip')
          .style('left', 20 + 'px')
          .style('top', 0 + 'px')
          .html('<table class=' + 'table table-striped table-sm' + '>'
            + '<thead>'
              + '<tr>'
                + '<th class=' + 'state_title ' + 'scope=' + 'col' + '>' + d['properties'].name + '</th>'
                + '<th class=' + 'state_title ' + 'scope=' + 'col' + '>' + '% for Trump' + '</th>'
              + '</tr>'
            + '</thead>'
            + '<tbody>'
            + '<tr>'
              + '<td class=' + 'state_title' + '>' + '<strong>' + 'Actual' + '</strong> </td>'
              + '<td class=' + 'state_title' + '>' + '<strong>' + '<strong>' +
              parseFloat((d['properties'].actual)).toFixed(1) + '%' + '</strong></td>'
            + '</tr>'
            + '<tr>'
              + '<td>' + 'Model' + '</td>'
              + '<td>' + parseFloat((d['properties'].value))  + '%' + '</td>'
            + '</tr>'
          + '</tbody>'
          + '</table>'
          + '<p class = ' + 'error_value' + '>' + '<strong>' + 'Model Error (' +
          parseFloat((d['properties'].diff)).toFixed(1) + '%' + ')' + '</strong>' + '</p>'
          );

            // Show the tooltip
            d3.select('#tooltip').classed('hidden', false);
          })
          .on('mouseout', function() {
              d3.select('#tooltip').classed('hidden', true);

              svg.selectAll('path')
              .attr('d', path)
              .style('fill', function(d) {
                const value = d['properties'].actual;
                  if (value) {
                    return color(d['properties'].actual);
                  } else {
                    return '#ddd';
                  }
              })
              .style('opacity', '1');

              d3.select(this)
                .style('stroke-width', '1')
                .style('stroke', '#333');

          });
        }, 2000);

  }
}
