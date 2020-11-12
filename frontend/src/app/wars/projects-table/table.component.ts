import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { ProjectType } from '@monorepo/interfaces/project/projects-query.dto.interface';
import { warsService } from '@shared/providers/projects.service';
import { OnDestroyMixin, untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { ProjectsDataSource } from '@modules/dashboard/projects/projects-table/projects-data-source';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  exportAs: 'appTable',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent extends OnDestroyMixin implements OnDestroy, AfterViewInit {
  ProjectType = ProjectType;

  displayedColumns$: Observable<string[]>;
  dataSource = new ProjectsDataSource(this.route.snapshot.data.type as ProjectType);
  selection = new SelectionModel<number>(true, []); // projectIds
  pageSizes = [20, 50, 100];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  private readonly search = new BehaviorSubject<string>('');

  constructor(public route: ActivatedRoute,
              private wars: warsService) {
    super();
    this.displayedColumns$ = route.data.pipe(map(({type}) => type === ProjectType.my
      ? ['select', 'name', 'country', 'client', 'field', 'pad', 'well', 'edit']
      : ['select', 'name', 'country', 'client', 'field', 'pad', 'well', 'edit']));
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
      this.dataSource.data = projects.items;
      this.paginator.length = projects.totalItems;
      this.paginator.pageIndex = projects.currentPage;

      if (this.selection.selected.some(selectedId => !projects.items.find(p => selectedId === p.id))) {
        this.selection.clear();
      }
    });

    this.dataSource.filter.pipe(
      switchMap(f => this.wars.getFilterOptions({
        type: this.dataSource.type,
        ...f
      }))
    ).subscribe();
  }

  searchByName(value: string): void {
    this.search.next(value);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ? this.selection.clear() : this.selection.select(...this.dataSource.data.map(p => p.id));
  }
}
