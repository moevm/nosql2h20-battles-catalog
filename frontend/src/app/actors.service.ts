import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ActorsService {
  private readonly list = new BehaviorSubject<string[]>([]);
  readonly list$: Observable<string[]> = this.list.pipe(distinctUntilChanged());

  constructor(private http: HttpClient) {
    this.http.get<{actors: string[]}>('actors').subscribe(({actors}) => this.list.next(actors));
  }
}
