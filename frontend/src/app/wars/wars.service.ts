import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IWars } from './interfaces/wars.interface';
import { IWarsQuery } from './interfaces/wars-query.interface';
import { distinctUntilChanged, map, take, tap } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { IWar } from './interfaces/war.interface';

@Injectable({
  providedIn: 'root'
})
export class WarsService {
  readonly list$: Observable<IWars>;
  readonly namesList$: Observable<string[]>;
  readonly filterOptions$: Observable<any>;
  readonly currentGetParams = new BehaviorSubject<IWarsQuery>({limit: 20, page: 0});
  readonly selection = new SelectionModel<IWar>(true);

  private readonly list = new ReplaySubject<IWars>();
  private readonly filterOptions = new BehaviorSubject<any>({});

  constructor(private http: HttpClient) {
    this.list$ = this.list.pipe(distinctUntilChanged<IWars>());
    this.namesList$ = this.list$.pipe(take<IWars>(1), map(list => list.items.map(war => war.name)));
    this.filterOptions$ = this.filterOptions.pipe(distinctUntilChanged());
  }

  // getFilterOptions(query: IProjectsFilterOptionsQueryDto): Observable<IProjectsFilterOptionsQueryDto> {
  //   const data = {};
  //   for (const i in query) {
  //     if (query.hasOwnProperty(i)) {
  //       let prop = query[i];
  //       if (Array.isArray(query[i])) {
  //         prop = prop.join(',');
  //       }
  //       data[i] = prop;
  //     }
  //   }
  //   return this.http.get<IProjectsFilterOptionsQueryDto>(Path.projects.filterOptions(), {params: {...data}}).pipe(
  //     tap(options => this.filterOptions.next(options)));
  // }

  get(): Observable<IWars> {
    const currentGetParams = this.currentGetParams.value;
    const params: any = {
      page: this.currentGetParams.value.page + 1,
      limit: this.currentGetParams.value.limit
    };

    if (currentGetParams.sort) {
      params.sort = currentGetParams.sort;
    }
    if (currentGetParams.name) {
      params.names = currentGetParams.name.toString();
    }
    if (currentGetParams.actors) {
      params.actors = currentGetParams.actors.toString();
    }
    if (currentGetParams.search) {
      params.search = currentGetParams.search;
    }
    if (currentGetParams.sort && currentGetParams.sort_dir) {
      params.sort_dir = currentGetParams.sort_dir;
    }

    return this.http.get<IWars>('wars', {params})
      .pipe(tap<IWars>(res => this.list.next(res)));
  }
}
