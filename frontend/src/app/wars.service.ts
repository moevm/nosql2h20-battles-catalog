import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, switchMapTo, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WarsService {
  readonly list$: Observable<IPaginationResult<IProjectDto>>;
  readonly filterOptions$: Observable<IProjectsFilterOptionsQueryDto>;
  readonly currentGetParams = new BehaviorSubject<IProjectsQueryDto>({limit: 20, page: 0});

  private readonly list = new ReplaySubject<IPaginationResult<IProjectDto>>();
  private readonly filterOptions = new BehaviorSubject<IProjectsFilterOptionsQueryDto>({});
  private readonly current = new BehaviorSubject<IProjectDetailsDto>(null);

  constructor(private http: HttpClient) {
    this.list$ = this.list.pipe(distinctUntilChanged());
    this.filterOptions$ = this.filterOptions.pipe(distinctUntilChanged());
  }

  getFilterOptions(query: IProjectsFilterOptionsQueryDto): Observable<IProjectsFilterOptionsQueryDto> {
    const data = {};
    for (const i in query) {
      if (query.hasOwnProperty(i)) {
        let prop = query[i];
        if (Array.isArray(query[i])) {
          prop = prop.join(',');
        }
        data[i] = prop;
      }
    }
    return this.http.get<IProjectsFilterOptionsQueryDto>(Path.projects.filterOptions(), {params: {...data}}).pipe(tap(
      options => this.filterOptions.next(options)));
  }

  get(): Observable<IPaginationResult<IProjectDto>> {
    const currentGetParams = this.currentGetParams.value;
    const params: any = {
      page: this.currentGetParams.value.page,
      limit: this.currentGetParams.value.limit
    };
    if (currentGetParams.search) {
      params.search = currentGetParams.search;
    }
    if (currentGetParams.sort) {
      params.sort = JSON.stringify(currentGetParams.sort);
    }
    if (currentGetParams.filter) {
      params.filter = JSON.stringify(currentGetParams.filter);
    }

    return this.http.get<IPaginationResult<IProjectDto>>(Path.projects(), {params})
      .pipe(tap(res => this.list.next(res)));
  }

  getProject(id: number): Observable<IProjectDetailsDto> {
    return this.http.get<IProjectDetailsDto>(Path.projects.project(id))
      .pipe(
        tap(project => this.current.next(project)),
        switchMapTo(this.current$)
      );
  }
}
