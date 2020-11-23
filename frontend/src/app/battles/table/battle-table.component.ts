import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { OnDestroyMixin, untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { TableDataSource } from './table-data-source';
import { ActorsService } from '../../actors.service';
import { BattlesService } from '../battles.service';
import { WarsService } from '../../wars/wars.service';

@Component({
  selector: 'app-battle-table',
  templateUrl: './battle-table.component.html',
  styleUrls: ['./battle-table.component.scss'],
  exportAs: 'appTable',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BattleTableComponent extends OnDestroyMixin implements OnDestroy, AfterViewInit {
  columns = ['select', 'name', 'date', 'duration', 'war', 'actors', 'army-sizes', 'losses'];
  dataSource = new TableDataSource();
  pageSizes = [20, 50, 100];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  private readonly search = new BehaviorSubject<string>('');

  constructor(public battles: BattlesService, public actors: ActorsService, public wars: WarsService) {
    super();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.search.subscribe(v => this.dataSource.search = v);

    this.dataSource.query.pipe(
      filter(v => !!v),
      tap(data => this.battles.currentGetParams.next(data)),
      switchMap(() => this.battles.get()),
      untilComponentDestroyed(this)
    ).subscribe();

    this.battles.list$.pipe(untilComponentDestroyed(this)).subscribe(projects => {
      this.dataSource.data = projects.items;
      this.paginator.length = projects.total;
      this.paginator.pageIndex = projects.current_page - 1;

      if (this.battles.selection.selected.some(
        selectedWar => !projects.items.find(p => selectedWar.name === p.name)
      )) {
        this.battles.selection.clear();
      }
    });

    // this.dataSource.filter.pipe(
    //   switchMap(f => this.wars.getFilterOptions({
    //     ...f
    //   }))
    // ).subscribe();
  }

  ngOnDestroy(): void {
    this.battles.selection.clear();
  }

  searchByName(value: string): void {
    this.search.next(value);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.battles.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
}
