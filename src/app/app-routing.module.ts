import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PresRegressionComponent } from './components/pres-regression/pres-regression.component';
import { ChessEloComponent } from './components/chess-elo/chess-elo.component';
import { CoronavirusComponent } from './components/coronavirus/coronavirus.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'pres2016-regression', component: PresRegressionComponent},
  {path: 'chess-elo', component: ChessEloComponent },
  { path: 'coronavirus', component: CoronavirusComponent }
  // { path: 'cp-hike', component: CpHikeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
