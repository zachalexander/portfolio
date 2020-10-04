import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PresRegressionComponent } from './components/pres-regression/pres-regression.component';
import { ChessEloComponent } from './components/chess-elo/chess-elo.component';
import { CoronavirusComponent } from './components/coronavirus/coronavirus.component';
import { ResumeComponent } from './components/resume/resume.component';
import { NyStateMapComponent } from './components/ny-state-map/ny-state-map.component';
import { FallfoliageComponent } from './components/fallfoliage/fallfoliage.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'pres2016-regression', component: PresRegressionComponent},
  {path: 'chess-elo', component: ChessEloComponent },
  { path: 'coronavirus', component: CoronavirusComponent },
  { path: 'resume', component: ResumeComponent},
  { path: 'foliage', component: FallfoliageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
