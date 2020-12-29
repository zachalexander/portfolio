import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as firstModel from '../../../assets/first20_med_a2.json';
import * as secondModel from '../../../assets/second20_med_a2.json';
import * as thirdModel from '../../../assets/third20_med_a2.json';
import * as fourthModel from '../../../assets/fourth20_med_a2.json';

import * as firstModel_b1 from '../../../assets/first20_med_b1.json';
import * as secondModel_b1 from '../../../assets/second20_med_b1.json';
import * as thirdModel_b1 from '../../../assets/third20_med_b1.json';
import * as fourthModel_b1 from '../../../assets/fourth20_med_b1.json';

import * as topTen_a2 from '../../../assets/top10_a2.json';
import * as topTen_b1 from '../../../assets/top10_b1.json';

import * as russiaMap from '../../../assets/russia.json';
import * as afghanistanMap from '../../../assets/afghanistan.json';
import * as canadaMap from '../../../assets/canada.json';
import * as usMap from '../../../assets/us.json';

@Component({
  selector: 'app-climate-change',
  templateUrl: './climate-change.component.html',
  styleUrls: ['./climate-change.component.scss']
})
export class ClimateChangeComponent implements OnInit {
  play = false;
  refresh = false;
  progress = false;

  firstModelData = firstModel['default'];
  secondModelData = secondModel['default'];
  thirdModelData = thirdModel['default'];
  fourthModelData = fourthModel['default'];
  firstModel_b1 = firstModel_b1['default']
  secondModel_b1 = secondModel_b1['default']
  thirdModel_b1 = thirdModel_b1['default']
  fourthModel_b1 = fourthModel_b1['default']

  russiaMapData = russiaMap['default']
  afghanistanMapData = afghanistanMap['default']
  canadaMapData = canadaMap['default']
  usMapData = usMap['default']

  topTen_a2Data = topTen_a2['top-ten-bar-a2']
  topTen_b1Data = topTen_b1['top-ten-bar-b1']

  dateRange = ['2020 - 2040', '2040 - 2060', '2060 - 2080', '2080 - 2100'];
  titleTag;
  divname;

  autoTicks = true;
  disabled = false;
  invert = false;
  max = 2100;
  min = 2040;
  showTicks = true;
  step = 20;
  thumbLabel = true;
  value = 2040;
  vertical = false;
  tickInterval = 20;

  sliderDate;
  drawCallout;

  jsons;
  jsons_a2 = [this.firstModelData, this.secondModelData, this.thirdModelData, this.fourthModelData];
  jsons_b1 = [this.firstModel_b1, this.secondModel_b1, this.thirdModel_b1, this.fourthModel_b1];

  scenarioAtwo = true;
  scenarioBone = false;

  canadaPick = false;

  svgWidth;
  xMargin;
  graphShift;

  scenario = 'Scenario A2';

  getSliderTickInterval(): number | 'auto' {
    if (this.showTicks) {
      return this.autoTicks ? 'auto' : this.tickInterval;
    }

    return 0;
  }

  ngOnInit() {
    let width = window.innerWidth;
    this.jsons = this.jsons_a2;

    d3.select('.canada-div').style('display', 'block');

    let windowWidth = width;

    if (windowWidth <= 500) {
      this.svgWidth = 375;
      this.xMargin = 50;
      this.graphShift = 50;
    } else {
      this.svgWidth = 400;
      this.xMargin = 30;
      this.graphShift = 40;
    }
    
    if (width > 500) {
      width = 500;
    }
    
    this.setMap(1000, 600, this.jsons[0])
    this.drawBarChart(width, this.topTen_a2Data, '.top10-a2');
    this.drawBarChart(width, this.topTen_b1Data, '.top10-b1');
    
    this.drawCountry(this.russiaMapData, '.russia-map', 300, 200, [0, 250], 90, this.svgWidth, this.xMargin, this.graphShift)
    this.drawCountry(this.canadaMapData, '.canada-map', 300, 200, [310, 260], 90, this.svgWidth, this.xMargin, this.graphShift)
    this.drawCountry(this.afghanistanMapData, '.afghanistan-map', 300, 200, [-480, 510], 650, this.svgWidth, this.xMargin, this.graphShift)
    this.drawCountry(this.usMapData, '.us-map', 300, 200, [400, 220], 120, this.svgWidth, this.xMargin, this.graphShift)
    this.drawLineChart(this.canadaMapData, '.canada-div', this.svgWidth, this.xMargin, this.graphShift)
  }

  scenarioA2(){
    this.scenarioAtwo = true;
    this.scenarioBone = false;
    this.jsons = this.jsons_a2;

    this.scenario = 'Scenario A2';

    d3.select('svg').remove();

    this.setMap(1000, 600, this.jsons[0])
  }

  scenarioB1(){
    this.scenarioAtwo = false;
    this.scenarioBone = true;
    this.jsons = this.jsons_b1;

    this.scenario = 'Scenario B1';

    d3.select('svg').remove();

    this.setMap(1000, 600, this.jsons[0])
  }

  pitch(event: any) {
    this.sliderDate = event.value;
    const sliderArray = ['2040', '2060', '2080', '2100'];
    this.thumbLabel = true;

    const i = sliderArray.indexOf(this.sliderDate.toString());

    this.transitionMap(this.jsons, i)
  }



  setMap(width, height, datapull) {

    d3.select('#stop').style('visibility', 'hidden');

    
    this.titleTag = this.dateRange[0];

    const margin = {top: 10, right: 30, bottom: 10, left: 30};
  
    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

    const projection = d3.geoMercator()
    .rotate([-11, 0])
    .scale(1)
    .translate([0, 0]);

    const path = d3.geoPath()
              .projection(projection);
  
    const svg = d3.select('.world-map')
                .append('svg')
                .attr('class', 'map')
                .attr('x', 0)
                .attr('y', 0)
                .attr('viewBox', '0 0 1000 600')
                .attr('preserveAspectRatio', 'xMidYMid')
                .style('max-width', 1200)
                .style('margin', 'auto')
                .style('display', 'flex');

    const b = path.bounds(datapull),
        s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
        t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

    const color_domain = [2.5, 4, 7, 9, 10];

    const color_legend = d3.scaleThreshold<string>()
    .range(['#fee5d9', '#fcbba1', '#fc9272', '#fb6a4a', '#de2d26', '#a50f15'])
    .domain(color_domain);

    
    projection.scale(s)
        .translate(t);

    svg.selectAll('path')
      .data(datapull.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('id', 'unselected')
      .style('fill', function(d) {
        const value = d['Change_f'];
          if (value) {  
            return color_legend(d['Change_f']);
          } else {
            return '#ccc';
          }
      })
      .style('stroke', '#fff')
      .style('stroke-width', '0.5')
      .classed('svg-content-responsive', true);

  }

  transitionMap(json, i) {
    const svg = d3.select('.world-map');

    this.titleTag = this.dateRange[i];

    const sliderArray = ['2040', '2060', '2080', '2100'];

    this.value = parseInt(sliderArray[i]);

    const color_domain = [2.5, 4, 7, 9, 10];
    
    const color_legend = d3.scaleThreshold<string>()
    .range(['#fee5d9', '#fcbba1', '#fc9272', '#fb6a4a', '#de2d26', '#a50f15'])
    .domain(color_domain);

    console.log(json[i].features)


    svg.selectAll('path')
       .data(json[i].features)
       .transition()
       .delay(100)
       .duration(1000)
       .style('fill', function(d) {
        const value = d['Change_f'];
          if (value) {  
            return color_legend(d['Change_f']);
          } else {
            return '#ccc';
          }
      })
  }

  playButton() {

    this.play = true;
    this.progress = true;


    let time = 1;

    let interval = setInterval(() => { 
      if (time <= 3) { 
          this.transitionMap(this.jsons, time)
          time++;
      }
      else { 
          clearInterval(interval);
          this.progress = false;
          this.refresh = true;
      }
    }, 2000);

  }

  refreshButton() {
    let width = window.innerWidth;

    if (width > 1000) {
      width = 1000;
    }

    d3.select('svg').remove();
    this.setMap(1000, 600, this.jsons[0])

    this.play = false;
    this.refresh = false;
    this.value = 2040;
  }

  drawBarChart(width, dataset, divname) {

    const svgbar = d3.select(divname)
    .append('svg')
    .attr('width', width)
    .attr('height', '400')
    .classed('overall-bar', true);

    const color_domain = [2.5, 4, 7, 9, 10];
    
    const color_legend = d3.scaleThreshold<string>()
    .range(['#fee5d9', '#fcbba1', '#fc9272', '#fb6a4a', '#de2d26', '#a50f15'])
    .domain(color_domain);

    const margin = { top: 20, right: 50, bottom: 20, left: 50 };
    const height = 400 - margin.top - margin.bottom;

    const xScale = d3.scaleLinear().rangeRound([0, width]);
    const yScale = d3.scaleBand().rangeRound([0, height]).padding(0.05);
    
    xScale.domain([0, 12]);
    yScale.domain(dataset.map((d) => d['country']));

    svgbar.append('g')
    .selectAll('rect')
    .data(dataset)
    .enter().append('rect')
    .attr('y', function (d) { return yScale(d['country']); })
    .attr('x', 10)
    .attr('height', yScale.bandwidth())
    .attr('width', function (d) {
      return xScale(d['temp']) - margin.right - 30;
    })
    .attr('fill', function(d) {
      return color_legend(d['temp']);
    })
    .classed('temp-rects');

    svgbar.selectAll('rect.temp-rects')
    .data(dataset)
    .enter().append('text')
    .attr('x', 20)
    .attr('y', function(d) { 
      return yScale(d['country']) + yScale.bandwidth() / 2 + 4; 
    })
    .text(function(d) {
      return d['country'] + ' (' + '+' + d['temp'] + '\xB0' + 'F)';
    })
    .style('font-size', '12px')
    .style('font-weight', '600')
    .style('fill', '#ffffff')
    .style('font-family', 'Montserrat')
  }

  drawCountry(countryjson, countrydiv, width, height, translate, scale, windowWidth, xMargin, graphShift) {

    const projection = d3.geoMercator()
    .rotate([-11, 0])
    .scale(scale)
    .translate(translate);

    const path = d3.geoPath()
              .projection(projection);
  
    const svg = d3.select(countrydiv)
                .append('svg')
                .attr('class', 'country')
                .attr('width', width)
                .attr('height', height)
                .attr('viewBox', '0 0 300 200')
                .attr('preserveAspectRatio', 'xMidYMid')
                .style('max-width', 1200)
                .style('margin', 'auto')
                .style('display', 'flex');

            
    svg.selectAll('path')
      .data(countryjson)
      .enter()
      .append('path')
      .attr('d', path)
      .style('fill', '#fcbba1')
      .style('stroke', '#de2d26')
      .style('stroke-width', '0.5')
      .on('mouseover', function (d) {

        d3.select(this)
          .style('cursor', 'pointer')
          .style('stroke-width', '1.5')
          .style('font-size', '2em')

      })
      .on('mouseout', function (d) {
        d3.select(this)
          .style('stroke-width', '0.5');
      })
      .style('fill', '#fcbba1')
      .on('click', function(d) {

        d3.select('.jumbo').remove()
        
        const margin = {top: 10, right: 10, bottom: 10, left: 10};

        if (d.properties.name === 'Canada') {
          d3.select('.canada-div').style('display', 'block');
          d3.select('.russia-div').style('display', 'none')
          d3.select('.afghanistan-div').style('display', 'none')
          d3.select('.us-div').style('display', 'none')
        } else if (d.properties.name === 'Russia') {
          d3.select('.russia-div').style('display', 'block')
          d3.select('.afghanistan-div').style('display', 'none')
          d3.select('.canada-div').style('display', 'none');
          d3.select('.us-div').style('display', 'none')
        } else if (d.properties.name === 'Afghanistan') {
          d3.select('.afghanistan-div').style('display', 'block')
          d3.select('.russia-div').style('display', 'none')
          d3.select('.canada-div').style('display', 'none');
          d3.select('.us-div').style('display', 'none')
        } else if (d.properties.name === 'United States of America') {
          d3.select('.afghanistan-div').style('display', 'none')
          d3.select('.russia-div').style('display', 'none')
          d3.select('.canada-div').style('display', 'none');
          d3.select('.us-div').style('display', 'block')
        }     

 
        const data = d['trend-data'];
        const width = windowWidth;
        const yheight = 200;
        const height = 300;

        const parseTime = d3.timeParse('%m/%d/%Y');

        const x = d3.scaleTime().range([0, width - margin.left - margin.right - xMargin]);
        x.domain(d3.extent(data, function(d) { return parseTime(d.date); }));

        const y = d3.scaleLinear().range([yheight, 0]).nice();
        y.domain([0, 12]);


        const valueline = d3.line()
        .x(function(d) { return x(parseTime(d.date)); })
        .y(function(d) { return y(d.a2) + margin.top + margin.bottom; })
        .curve(d3.curveMonotoneX);

        const valueline_b = d3.line()
        .x(function(d) { return x(parseTime(d.date)); })
        .y(function(d) { return y(d.b1) + margin.top + margin.bottom; })
        .curve(d3.curveMonotoneX);

        const svg = d3.select('.line-wrapper').append('svg')
        .attr('width',  width - margin.left - margin.right + 30)
        .attr('height', height - margin.top - margin.bottom)
        .attr('x', 0)
        .attr('y', 0)
        .attr('class', 'jumbo')
        .append('g')
        .attr('transform', 'translate(' + graphShift + ', 0)')


        // Add the x-axis.
        svg.append('g')
              .attr("class", "y-axis")
              .attr("transform", "translate(0," + (margin.top + margin.bottom) + ")")
              .call(d3.axisLeft(y).ticks(4).tickSizeOuter(0).tickFormat(d => '+' + d + '\xB0' + 'F'));

        svg.append('g')
              .attr("class", "x-axis")
              .attr("transform", "translate(0," + (yheight + margin.top + margin.bottom) + ")")
              .call(d3.axisBottom(x).ticks(4).tickSizeOuter(1));

        d3.select('.x-axis .tick:first-child').remove()

        const path = svg.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke-width', '3px')
        .attr('stroke', '#de2d26')
        .attr('d', valueline);

        const path_b = svg.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke-width', '3px')
        .attr('stroke', '#fc9272')
        .attr('d', valueline_b);

        const ext_color_domain = [25, 35, 45, 55, 65];


        const ls_w = 15, ls_h = 15;

        const legend = svg.append('g')
        .data(ext_color_domain)
        .attr('class', 'legend');


        const totalLength = path.node().getTotalLength();

        path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .on('start', function repeat() {
            d3.active(this)
                .duration(3000)
                .ease(d3.easeLinear)
                .attr('stroke-dashoffset', 0);
        });

        path_b.attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .on('start', function repeat() {
            d3.active(this)
                .duration(3000)
                .ease(d3.easeLinear)
                .attr('stroke-dashoffset', 0);
        });


        legend.append('rect')
          .attr('x', 20)
          .attr('y', 30)
          .attr('width', ls_w)
          .attr('height', ls_h)
          .style('fill', function (d, i) { return '#de2d26'; })
          .style('opacity', 0.8);
          
        legend.append('rect')
        .attr('x', 20)
        .attr('y', 50)
        .attr('width', ls_w)
        .attr('height', ls_h)
        .style('fill', function (d, i) { return '#fc9272'; })
        .style('opacity', 0.8);

        legend.append('text')
        .attr('x', 40)
        .attr('y', 42)
        .attr('font-size', '12px')
        .attr('font-weight', '500')
        .attr('fill', '#de2d26')
        .text('Scenario A2')

        legend.append('text')
          .attr('x', 40)
          .attr('y', 62)
          .attr('font-size', '12px')
          .attr('font-weight', '500')
          .attr('fill', '#fc9272')
          .text('Scenario B1');

      })

    svg.selectAll('text')
      .data(countryjson)
      .enter().append('text')
      .attr('x', function(d) {
        return path.centroid(d)[0];
      })
      .attr('y', function(d) {
          return path.centroid(d)[1];
      })
      .attr('text-anchor', 'middle')
      .attr('font-size', '1.25em')
      .attr('font-weight', '600')
      .attr('fill', '#a50f15')
      .text(function(d){
        return d.properties.name;
      })

    
  }

  drawLineChart(countryjson, countrydiv, windowWidth, xMargin, graphShift) {
       
        const margin = {top: 10, right: 10, bottom: 10, left: 10};
        const data = countryjson[0]['trend-data'];
        const width = windowWidth;
        const yheight = 200;
        const height = 300;

        const parseTime = d3.timeParse('%m/%d/%Y');

        const x = d3.scaleTime().range([0, width - margin.left - margin.right - xMargin]);
        x.domain(d3.extent(data, function(d) { return parseTime(d.date); }));

        const y = d3.scaleLinear().range([yheight, 0]).nice();
        y.domain([0, 12]);


        const valueline = d3.line()
        .x(function(d) { return x(parseTime(d.date)); })
        .y(function(d) { return y(d.a2) + margin.top + margin.bottom; })
        .curve(d3.curveMonotoneX);

        const valueline_b = d3.line()
        .x(function(d) { return x(parseTime(d.date)); })
        .y(function(d) { return y(d.b1) + margin.top + margin.bottom; })
        .curve(d3.curveMonotoneX);

        const svg = d3.select('.line-wrapper').append('svg')
        .attr('width',  width - margin.left - margin.right + 30)
        .attr('height', height - margin.top - margin.bottom)
        .attr('x', 0)
        .attr('y', 0)
        .attr('class', 'jumbo')
        .append('g')
        .attr('transform', 'translate(' + graphShift + ', 0)')

        // Add the x-axis.
        svg.append('g')
              .attr("class", "y-axis")
              .attr("transform", "translate(0," + (margin.top + margin.bottom) + ")")
              .call(d3.axisLeft(y).ticks(4).tickSizeOuter(0).tickFormat(d => '+' + d + '\xB0' + 'F'));

        svg.append('g')
              .attr("class", "x-axis")
              .attr("transform", "translate(0," + (yheight + margin.top + margin.bottom) + ")")
              .call(d3.axisBottom(x).ticks(4).tickSizeOuter(1));

        d3.select('.x-axis .tick:first-child').remove()

        const path = svg.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke-width', '3px')
        .attr('stroke', '#de2d26')
        .attr('d', valueline);

        const path_b = svg.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke-width', '3px')
        .attr('stroke', '#fc9272')
        .attr('d', valueline_b);

        const ext_color_domain = [25, 35, 45, 55, 65];

        const ls_w = 15, ls_h = 15;

        const legend = svg.append('g')
        .data(ext_color_domain)
        .attr('class', 'legend');

        legend.append('rect')
          .attr('x', 20)
          .attr('y', 30)
          .attr('width', ls_w)
          .attr('height', ls_h)
          .style('fill', function (d, i) { return '#de2d26'; })
          .style('opacity', 0.8);
          
        legend.append('rect')
        .attr('x', 20)
        .attr('y', 50)
        .attr('width', ls_w)
        .attr('height', ls_h)
        .style('fill', function (d, i) { return '#fc9272'; })
        .style('opacity', 0.8);

        legend.append('text')
        .attr('x', 40)
        .attr('y', 42)
        .attr('font-size', '12px')
        .attr('font-weight', '500')
        .attr('fill', '#de2d26')
        .text('Scenario A2')

        legend.append('text')
          .attr('x', 40)
          .attr('y', 62)
          .attr('font-size', '12px')
          .attr('font-weight', '500')
          .attr('fill', '#fc9272')
          .text('Scenario B1');

      }

      scrollDiv($element): void {
        $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
      }


  }
