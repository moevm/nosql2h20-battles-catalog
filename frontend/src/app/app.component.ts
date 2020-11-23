import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateBattleFormComponent } from './components/create-battle-form/create-battle-form.component';
import { WarCompareComponent } from './components/compare/war-compare/war-compare.component';
import { BattleCompareComponent } from './components/compare/battle-compare/battle-compare.component';
import { ActivatedRoute, Router } from '@angular/router';
import { WarsService } from './wars/wars.service';
import { BattlesService } from './battles/battles.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public dialog: MatDialog,
              public router: Router,
              public wars: WarsService,
              public battles: BattlesService) {}

  openCreateBattleForm(): void {
    this.dialog.open(CreateBattleFormComponent, {minWidth: '85%'});
  }

  openCompareDialog(): void {
    this.dialog.open<any>(
      this.router.url.includes('wars') ? WarCompareComponent : BattleCompareComponent,
      {width: '95%', height: '95%'}
    );
  }
}
