import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatColumnDef, MatTable } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, map, withLatestFrom } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatSelectionList } from '@angular/material/list';
import { SelectionModel } from '@angular/cdk/collections';
import { WarsService } from '../../wars.service';
import { TableDataSource } from '../table-data-source';

@Component({
  selector: 'app-filter-header',
  templateUrl: './filter-header.component.html',
  styleUrls: ['./filter-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterHeaderComponent implements OnInit {
  selection = new SelectionModel<string>(true, []);
  search$ = new BehaviorSubject<string>('');
  options$: Observable<string[]>;
  filter$: Observable<string[]>;

  @Input() source: Observable<string[]>;

  @ViewChild('button', {read: ElementRef}) button: ElementRef;
  @ViewChild('filter') filter: TemplateRef<any>;
  @ViewChild('selectionList') selectionList: MatSelectionList;

  constructor(
    public table: MatTable<any>,
    public col: MatColumnDef,
    private wars: WarsService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.options$ = this.search$.pipe(
      debounceTime<string>(500),
      distinctUntilChanged(),
      withLatestFrom(this.source),
      map(([search, options]) =>
        options.filter(opt =>
          opt.toLocaleLowerCase().includes(search.toLowerCase())
        )
      )
    );

    this.filter$ = (this.table.dataSource as TableDataSource).filter.pipe(
      map(filter => filter[this.col.name] as string[] || [])
    );
  }

  open(e: Event, activeFilter: string[]): void {
    e.stopPropagation();

    const width = 220;
    const height = 332;
    const rect = (this.button.nativeElement as HTMLElement).getBoundingClientRect() as DOMRect;
    const left = rect.x - width / 1.5;
    const top = rect.y + rect.height;
    const toPx = v => `${v}px`;

    this.selection.clear();
    this.selection.select(...activeFilter);

    this.dialog.open(this.filter, {
      minWidth: toPx(width), height: toPx(height), backdropClass: 'filter-dialog', position: {
        left: toPx(left), top: toPx(top),
      }
    });
  }

  search(event: Event): void {
    this.search$.next((event.currentTarget as any).value);
  }

  masterToggle(options: string[]): void {
    this.selection.selected.length === options.length ? this.selection.clear() : this.selection.select(...options);
  }

  isAllSelected(options: string[]): boolean {
    return this.selection.selected.length === options.length;
  }

  apply(): void {
    const filter = (this.table.dataSource as TableDataSource).filter.value;
    if (this.selection.selected.length) {
      filter[this.col.name] = this.selection.selected;
    } else {
      delete filter[this.col.name];
    }

    (this.table.dataSource as TableDataSource).filter.next({...filter});
  }
}
