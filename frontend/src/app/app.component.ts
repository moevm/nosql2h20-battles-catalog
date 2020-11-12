import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateBattleFormComponent } from './components/create-battle-form/create-battle-form.component';
import { WarCompareComponent } from './components/compare/war-compare/war-compare.component';
import { BattleCompareComponent } from './components/compare/battle-compare/battle-compare.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public dialog: MatDialog) {}

  openCreateBattleForm(): void {
    this.dialog.open(CreateBattleFormComponent, {minWidth: '85%'});
  }

  openWarCompare(): void {
    this.dialog.open(WarCompareComponent, {width: '95%', height: '95%'});
  }

  openBattleCompare(): void {
    this.dialog.open(BattleCompareComponent, {width: '95%', height: '95%'});
  }
}
