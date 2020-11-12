import { DataSource } from '@angular/cdk/collections';
import { IProjectDto } from '@monorepo/interfaces/project/project.dto.interface';
import { BehaviorSubject, merge, of, Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import {
  IProjectsFilterOptionsDto, IProjectsQueryDto, ProjectType
} from '@monorepo/interfaces/project/projects-query.dto.interface';
import { map, pairwise, startWith, tap } from 'rxjs/operators';
import { SortOrder } from '@monorepo/interfaces/query/sort-query.interface';

export class TableDataSource extends DataSource<IProjectDto> {
  readonly query = new BehaviorSubject<IProjectsQueryDto>(null);
  readonly filter = new BehaviorSubject<IProjectsFilterOptionsDto>({});

  private readonly _data = new BehaviorSubject<IProjectDto[]>([]);
  private readonly _search = new BehaviorSubject<string>(null);
  private _updateSubscription = Subscription.EMPTY;

  constructor(public type: ProjectType) { super(); }

  get data(): IProjectDto[] { return this._data.value; }

  set data(data) { this._data.next(data); }

  get search(): string { return this._search.value; }

  set search(search: string) { this._search.next(search); }

  private _sort: MatSort;

  get sort(): MatSort { return this._sort; }

  set sort(sort: MatSort) {
    this._sort = sort;
    this._updateChangeSubscription();
  }

  private _paginator: MatPaginator;

  get paginator(): MatPaginator { return this._paginator; }

  set paginator(paginator: MatPaginator) {
    this._paginator = paginator;
    this._updateChangeSubscription();
  }

  connect(): BehaviorSubject<IProjectDto[]> { return this._data; }

  disconnect(): void { }

  _updateChangeSubscription(): void {
    if (!this._paginator) { return; }

    const sortChange = this._sort ? this._sort.sortChange : of(null);
    merge(sortChange, this._search, this.filter).subscribe(_ => this._paginator.pageIndex = 0);
    const pageChange = this._paginator.page.pipe(
      startWith({pageSize: this._paginator.pageSize}),
      pairwise(),
      tap(([prevPage, curPage]) => prevPage.pageSize !== curPage.pageSize && (this._paginator.pageIndex = 0))
    );

    this._updateSubscription.unsubscribe();
    this._updateSubscription = merge(sortChange, pageChange, this._search, this.filter)
      .pipe(map(_ => ({
        sort: this._sort?.direction ? ({[this._sort.active]: this._sort.direction as SortOrder}) : {},
        search: this.search,
        type: this.type,
        limit: this._paginator.pageSize,
        page: this._paginator.pageIndex,
        filter: this.filter.value
      }))).subscribe(query => this.query.next(query));
  }
}
