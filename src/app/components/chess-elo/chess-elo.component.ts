import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import chessdata from '../../../assets/chess_ratings.json';

@Component({
  selector: 'app-chess-elo',
  templateUrl: './chess-elo.component.html',
  styleUrls: ['./chess-elo.component.scss']
})
export class ChessEloComponent implements OnInit {

  title = 'data607chess';
  chessPlayers = [];
  sortedTable = [];
  topPlayers = [];
  playersByDifference = [];
  rankedPlayers = [];
  topFiveImprove = [];
  bottomFiveDecline = [];
  clicked = false;

  constructor() { }

  ngOnInit() {

    const width = window.innerWidth;

    const svg = d3.select('svg')
      .attr('width', width - 80)
      .attr('max-width', 960 - 80)
      .attr('height', 960)
      .append('g').classed('overall-div', true);

    this.getTopPlayers(chessdata);
    this.drawEloChart(svg, width);

    this.chessPlayers = chessdata.sort(function (a, b) { return a.rating_difference - b.rating_difference; });
    this.playersByDifference = chessdata.sort(function (a, b) { return a.rating_difference - b.rating_difference; });
    this.rankPlayers(chessdata);
  }

  createChessData(dataset) {
    dataset.push({ chessdata });
    return dataset;
  }

  getTopPlayers(dataset) {
    dataset.map((players) => {
      if (players.player_pre_rating >= 1666) {
        this.topPlayers.push(players);
      }
    });
    this.topPlayers = this.topPlayers.sort(function (a, b) { return b.player_pre_rating - a.player_pre_rating; });

  }

  rankPlayers(dataset) {
    this.rankedPlayers = chessdata.sort(function (a, b) { return b.player_pre_rating - a.player_pre_rating; });
    console.log(this.rankedPlayers);
    this.rankedPlayers.map((players) => {
      if (players.rating_difference >= 156) {
        this.topFiveImprove.push(players)
      }
      if (players.rating_difference <= -63) {
        this.bottomFiveDecline.push(players);
      }
      this.topFiveImprove = this.topFiveImprove.sort(function (a, b) { return b.rating_difference - a.rating_difference; });
      this.bottomFiveDecline = this.bottomFiveDecline.sort(function (a, b) { return a.rating_difference - b.rating_difference; });

    });
  }

  sortData(dataset) {
    this.sortedTable = dataset.sort(function (a, b) { return b['rating_difference'] - a['rating_difference']; });
    return this.sortedTable;
  }

  drawEloChart(svg, wid) {

    this.clicked = false;

    const margin = { top: 20, right: 150, bottom: 80, left: 150 };
    const width = (wid) - margin.left - margin.right;
    const height = 960 - margin.top - margin.bottom;
    const pre = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    chessdata.sort(function (a, b) { return b.player_pre_rating - a.player_pre_rating; });

    const yScale = d3.scaleBand().rangeRound([0, height]).padding(0.05);
    yScale.domain(chessdata.map((d) => d['player_name']));

    const xScale = d3.scaleLinear().rangeRound([0, width]);
    xScale.domain([0, d3.max(chessdata, function (d) { return d['player_pre_rating'] + d['rating_difference']; })]).nice();

    d3.select('svg')
      .append('rect')
      .attr('y', '2')
      .attr('x', function (d) { return width / 2; })
      .attr('height', '12')
      .attr('width', '12')
      .attr('fill', 'rgba(210, 210, 210, 0.5)');

    d3.select('svg')
      .append('text')
      .attr('y', '12')
      .attr('x', function (d) { return (width / 2) + 25; })
      .attr('height', '12')
      .attr('width', '12')
      .attr('fill', 'rgba(210, 210, 210, 0.5)')
      .attr('stroke', '#111')
      .attr('font-size', '12px')
      .text('Pre-tournament elo rating');

    pre.selectAll('rect')
      .data(chessdata)
      .classed('bars', true)
      .enter().append('rect')
      .attr('y', function (d) { return yScale(d['player_name']); })
      .attr('x', function (d) { return ((xScale(d['player_pre_rating']) + width) - width) - xScale(d['player_pre_rating']); })
      .attr('height', yScale.bandwidth())
      .attr('width', function (d) {
        return xScale(d['player_pre_rating']);
      })
      .on('mouseover', function (d) {

        const yPosition = parseFloat(d3.select(this).attr('y'));
        const xPosition = parseFloat(d3.select(this).attr('x'));
        const barWidth = parseFloat(d3.select(this).attr('width'));
        const barHeight = parseFloat(d3.select(this).attr('height'));

        d3.select(this)
          .attr('stroke', '#111')
          .style('cursor', 'crosshair');

        d3.select('svg')
          .append('text')
          .classed('ranking', true)
          .attr('x', xScale(d['player_pre_rating'] / 2) + margin.right)
          .attr('y', yScale(d['player_name']) + yScale.bandwidth() * 2.5)
          .text(d['player_pre_rating'])
          .attr('fill', 'rgba(210, 210, 210, 0.5)')
          .style('font-size', '12px')
          .style('font-weight', '600')
          .style('fill', '#111')
          .style('pointer-events', 'none');

      })
      .on('mouseout', function (d) {
        d3.select(this)
          .attr('stroke', 'none')
          .attr('fill', 'rgba(210, 210, 210, 0.5)');

        d3.select('text.ranking').remove();
      })
      .attr('fill', 'rgba(210, 210, 210, 0.5)');

    pre.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,0)')
      .call(d3.axisLeft(yScale));

    pre.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(xScale).ticks(null))
      .append('text')
      .attr('y', 2)
      .attr('x', xScale(xScale.ticks().pop()) + 0.5)
      .attr('dy', '0.32em')
      .attr('fill', '#000')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'start');

    pre.append('text')
      .attr('transform',
        'translate(' + (width / 2) + ' ,' +
        (height + margin.top + 20) + ')')
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .text('Elo rating');
  }


  addPointChange() {
    this.clicked = true;
    const wid = window.innerWidth;

    const svg = d3.select('svg')
      .append('g').classed('overall-div', true)
      .attr('x', wid - 80)
      .attr('y', 0)
      .attr('viewBox', '0 0 960 960')
      .attr('preserveAspectRatio', 'xMidYMid');

    const margin = { top: 20, right: 150, bottom: 80, left: 150 };
    const width = wid - margin.left - margin.right;
    const height = 960 - margin.top - margin.bottom;
    const postGain = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    const postNeg = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    const pre = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    chessdata.sort(function (a, b) { return b.player_pre_rating - a.player_pre_rating; });

    const yScale = d3.scaleBand().rangeRound([0, height]).padding(0.05);
    yScale.domain(chessdata.map((d) => d['player_name']));

    const xScale = d3.scaleLinear().rangeRound([0, width]);
    xScale.domain([0, d3.max(chessdata, function (d) { return d['player_pre_rating'] + d['rating_difference']; })]).nice();


    d3.select('svg')
      .append('rect')
      .attr('y', '2')
      .attr('x', function (d) { return width / 1.1; })
      .attr('height', '12')
      .attr('width', '8')
      .attr('fill', '#E87461');

    d3.select('svg')
      .append('rect')
      .attr('y', '2')
      .attr('x', function (d) { return width / 1.1 + 8; })
      .attr('height', '12')
      .attr('width', '8')
      .attr('fill', '#7AC74F');

    d3.select('svg')
      .append('text')
      .attr('y', '12')
      .attr('x', function (d) { return (width / 1.1 + 8) + 25; })
      .attr('height', '12')
      .attr('width', '12')
      .attr('fill', 'rgba(210, 210, 210, 0.5)')
      .attr('stroke', '#111')
      .attr('font-size', '12px')
      .text('-/+ Elo Rating Change');


    postGain.selectAll('rect')
      .data(chessdata)
      .enter().append('rect')
      .attr('y', function (d) { return yScale(d['player_name']); })
      .attr('height', yScale.bandwidth())
      .attr('x', function (d) { return xScale(d['player_pre_rating']); })
      .attr('width', function (d) {
        if (d['change_pos'] === 'TRUE') {
          return xScale(d['rating_difference_sqr']);
        }
      })
      .attr('fill', '#7AC74F');

    postNeg.selectAll('rect')
      .data(chessdata)
      .enter().append('rect')
      .attr('y', function (d) { return yScale(d['player_name']); })
      .attr('height', yScale.bandwidth())
      .attr('x', function (d) { return xScale(d['player_pre_rating']) - xScale(d['rating_difference_sqr']); })
      .attr('width', function (d) {
        if (d['change_pos'] === 'FALSE') {
          return xScale(d['rating_difference_sqr']);
        }
      })
      .attr('fill', '#E87461');

    pre.selectAll('g')
      .data(chessdata)
      .enter().append('text')
      .attr('x', function (d) {
        if (d['change_pos'] === 'TRUE') {
          return xScale(d['player_pre_rating']) + xScale(d['rating_difference']) + 5;
        } else {
          return xScale(d['player_pre_rating']) + 5;
        }
      })
      .attr('y', function (d, i) {
        return yScale(d['player_name']) + yScale.bandwidth() / 2 + 4;
      })
      .text(function (d) {
        if (d['change_pos'] === 'TRUE') {
          return '+' + d['rating_difference'];
        } else {
          return d['rating_difference'];
        }
      })
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', function (d) {
        if (d['change_pos'] === 'TRUE') {
          return '#7AC74F';
        } else {
          return '#E87461';
        }
      });

    this.playersByDifference = chessdata.sort(function (a, b) { return a.rating_difference - b.rating_difference; });

  }

  removePointChange() {
    this.clicked = false;
    const width = window.innerWidth;
    d3.selectAll('g').remove();
    d3.selectAll('text').remove();
    d3.selectAll('rect').remove();

    const svg = d3.select('svg')
      .attr('width', width - 80)
      .attr('height', 960)
      .append('g').classed('overall-div', true);
    this.drawEloChart(svg, width);

    this.playersByDifference = chessdata.sort(function (a, b) { return a.rating_difference - b.rating_difference; });
  }

}

