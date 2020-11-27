import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateBattleFormComponent } from './components/create-battle-form/create-battle-form.component';
import { WarCompareComponent } from './components/compare/war-compare/war-compare.component';
import { BattleCompareComponent } from './components/compare/battle-compare/battle-compare.component';
import { ActivatedRoute, Router } from '@angular/router';
import { WarsService } from './wars/wars.service';
import { BattlesService } from './battles/battles.service';
import { ExportModalComponent } from './components/export-modal/export-modal.component';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  exportUrl = `${environment.baseUrl}/export`;

  constructor(public dialog: MatDialog,
              public router: Router,
              public wars: WarsService,
              public battles: BattlesService) {}

  openExportModal(): void {
    this.dialog.open(ExportModalComponent, {minWidth: '85%'});
  }

  openCompareDialog(): void {
    this.dialog.open<any>(
      this.router.url.includes('wars') ? WarCompareComponent : BattleCompareComponent,
      {width: '95%', height: '95%'}
    );
  }

  openCreateModal(): void {
    this.dialog.open(
      CreateBattleFormComponent,
      {minWidth: '75%'}
    );
  }
}
