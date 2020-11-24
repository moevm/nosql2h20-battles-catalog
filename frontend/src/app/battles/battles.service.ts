import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IBattles } from './interfaces/battles.interface';
import { IBattlesQuery } from './interfaces/battles-query.interface';
import { distinctUntilChanged, map, shareReplay, take, tap } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { IBattle } from './interfaces/battle.interface';
import { IWars } from '../wars/interfaces/wars.interface';

@Injectable({
  providedIn: 'root'
})
export class BattlesService {
  readonly list$: Observable<IBattles>;
  readonly namesList$: Observable<string[]>;
  readonly filterOptions$: Observable<any>;
  readonly currentGetParams = new BehaviorSubject<IBattlesQuery>({limit: 20, page: 0});
  readonly selection = new SelectionModel<IBattle>(true);

  private readonly list = new ReplaySubject<IBattles>();
  private readonly filterOptions = new BehaviorSubject<any>({});

  constructor(private http: HttpClient) {
    this.list$ = this.list.pipe(distinctUntilChanged<IBattles>());
    this.namesList$ = this.http.get<IWars>('battles?limit=100000000000000000&page=1').pipe(
      map(list => list.items.map(war => war.name)),
      shareReplay(1)
    );
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

  get(): Observable<IBattles> {
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
    if (currentGetParams.war) {
      params.wars = currentGetParams.war.toString();
    }

    return this.http.get<IBattles>('battles', {params})
      .pipe(tap<IBattles>(res => this.list.next(res)));
  }
}
