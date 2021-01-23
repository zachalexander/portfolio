import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PresRegressionComponent } from './components/pres-regression/pres-regression.component';
import { ChessEloComponent } from './components/chess-elo/chess-elo.component';
import { ResumeComponent } from './components/resume/resume.component';
import { ClimateChangeComponent } from './components/climate-change/climate-change.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'pres2016-regression', component: PresRegressionComponent},
  {path: 'chess-elo', component: ChessEloComponent },
  { path: 'resume', component: ResumeComponent},
  { path: 'climate-change', component: ClimateChangeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
