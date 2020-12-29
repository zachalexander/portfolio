import { Component, OnInit } from '@angular/core';
import * as nyMap from './../../../assets/northeastmap.json';
import * as countyMap from './../../../assets/us-counties.json';
import * as d3 from 'd3';

@Component({
  selector: 'app-fallfoliage',
  templateUrl: './fallfoliage.component.html',
  styleUrls: ['./fallfoliage.component.scss']
})
export class FallfoliageComponent implements OnInit {

  nystate = nyMap['features'];
  nyStateMap: Array<any>;

  constructor() { }

  ngOnInit() {
    this.nyStateMap = this.drawMap();
  }

  drawMap() {
    countyMap['features'].map(counties => {
      d3.csv('./../../../assets/us-counties-fixed.csv', function(elevation) {
        elevation.map(county => {
          if(counties.properties.GEO_ID === county.GEO_ID){
            counties.properties.elevation = parseInt(county.elevation);
          }
        });
      });
    });
    this.nystate = countyMap['features'];
    return this.nystate;
  }

}
