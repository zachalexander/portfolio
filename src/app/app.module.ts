import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { VgCoreModule } from 'videogular2/compiled/core';
import { VgControlsModule } from 'videogular2/compiled/controls';
import { VgOverlayPlayModule } from 'videogular2/compiled/overlay-play';
import {VgBufferingModule} from 'videogular2/compiled/buffering';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PresRegressionComponent } from './components/pres-regression/pres-regression.component';
import { ChessEloComponent } from './components/chess-elo/chess-elo.component';
import { CoronavirusComponent } from './components/coronavirus/coronavirus.component';
import { ResumeComponent } from './components/resume/resume.component';


import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MediumWidgetModule } from 'ngx-medium-widget';
import { LineAreaChartComponent } from './components/line-area-chart/line-area-chart.component';
import { NyStateMapComponent } from './components/ny-state-map/ny-state-map.component';
import { NyCityMapComponent } from './components/ny-city-map/ny-city-map.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarxhomeComponent } from './components/navbarxhome/navbarxhome.component';
import { SimplelinechartComponent } from './components/simplelinechart/simplelinechart.component';
import { SimplebarchartComponent } from './components/simplebarchart/simplebarchart.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PresRegressionComponent,
    ChessEloComponent,
    CoronavirusComponent,
    LineAreaChartComponent,
    NyStateMapComponent,
    NyCityMapComponent,
    NavbarComponent,
    FooterComponent,
    NavbarxhomeComponent,
    SimplelinechartComponent,
    SimplebarchartComponent,
    DateAgoPipe,
    SimplebarchartComponent,
    ResumeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FontAwesomeModule,
    MediumWidgetModule,
    HttpClientModule,
    FormsModule,
    NgxSpinnerModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    BsDropdownModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
