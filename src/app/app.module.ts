import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PresRegressionComponent } from './components/pres-regression/pres-regression.component';
import { ChessEloComponent } from './components/chess-elo/chess-elo.component';
import { CoronavirusComponent } from './components/coronavirus/coronavirus.component';


import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MediumWidgetModule } from 'ngx-medium-widget';
import { LineAreaChartComponent } from './components/line-area-chart/line-area-chart.component';
import { NyStateMapComponent } from './components/ny-state-map/ny-state-map.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PresRegressionComponent,
    ChessEloComponent,
    CoronavirusComponent,
    LineAreaChartComponent,
    NyStateMapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    MediumWidgetModule,
    HttpClientModule,
    FormsModule,
    NgxSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
