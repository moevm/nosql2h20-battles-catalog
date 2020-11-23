import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, merge, of, Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { map, pairwise, startWith, tap } from 'rxjs/operators';
import { IBattle } from '../interfaces/battle.interface';
import { IBattlesQuery } from '../interfaces/battles-query.interface';

const sortMap = {
  date: 'datetime_min',
  name: 'name',
  war: 'war',
  'army-sizes': 'actors.initial_state',
  losses: 'actors.casualties',
  actors: 'actors.actor_name'
};

export class TableDataSource extends DataSource<IBattle> {
  readonly query = new BehaviorSubject<IBattlesQuery>(null);
  readonly filter = new BehaviorSubject<any>({});

  private readonly _data = new BehaviorSubject<IBattle[]>([]);
  private readonly _search = new BehaviorSubject<string>(null);
  private _updateSubscription = Subscription.EMPTY;

  constructor() { super(); }

  get data(): IBattle[] { return this._data.value; }

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

  connect(): BehaviorSubject<IBattle[]> { return this._data; }

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
        sort: this._sort && this._sort.direction ? sortMap[this._sort.active] : null,
        sort_dir: this._sort && this._sort.direction === 'asc' ? 1 : -1,
        search: this.search,
        limit: this._paginator.pageSize,
        page: this._paginator.pageIndex,
        ...this.filter.value
      }))).subscribe(query => this.query.next(query));
  }
}
