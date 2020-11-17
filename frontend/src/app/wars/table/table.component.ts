import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { OnDestroyMixin, untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { WarsService } from '../wars.service';
import { TableDataSource } from './table-data-source';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  exportAs: 'appTable',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent extends OnDestroyMixin implements OnDestroy, AfterViewInit {
  columns = ['select', 'name', 'dates', 'duration', 'battles', 'actors', 'army-sizes', 'losses'];
  dataSource = new TableDataSource();
  pageSizes = [20, 50, 100];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  private readonly search = new BehaviorSubject<string>('');

  constructor(private wars: WarsService) {
    super();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.search.subscribe(v => this.dataSource.search = v);

    this.dataSource.query.pipe(
      filter(v => !!v),
      tap(data => this.wars.currentGetParams.next(data)),
      switchMap(() => this.wars.get()),
      untilComponentDestroyed(this)
    ).subscribe();

    this.wars.list$.pipe(untilComponentDestroyed(this)).subscribe(projects => {
      this.dataSource.data = projects.wars;
      this.paginator.length = projects.total;
      this.paginator.pageIndex = projects.current_page - 1;

      if (this.wars.selection.selected.some(selectedId => !projects.wars.find(p => selectedId === p.name))) {
        this.wars.selection.clear();
      }
    });

    // this.dataSource.filter.pipe(
    //   switchMap(f => this.wars.getFilterOptions({
    //     ...f
    //   }))
    // ).subscribe();
  }

  ngOnDestroy(): void {
    this.wars.selection.clear();
  }

  searchByName(value: string): void {
    this.search.next(value);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.wars.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
}