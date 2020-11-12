import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WarsComponent } from './wars/wars.component';
import { BattlesComponent } from './battles/battles.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'wars'
  },
  {
    path: 'wars',
    component: WarsComponent
  },
  {
    path: 'battles',
    component: BattlesComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
