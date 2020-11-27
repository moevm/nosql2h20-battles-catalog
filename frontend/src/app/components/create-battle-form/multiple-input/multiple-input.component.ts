import {
  AfterViewInit, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Optional,
  Output,
  ViewChild
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NgControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ValueAccessor } from '../../../shared/value-accessor';
import { matFormFieldAnimations } from '@angular/material/form-field';

@Component({
  selector: 'app-multiple-input',
  templateUrl: './multiple-input.component.html',
  styleUrls: ['./multiple-input.component.scss'],
  animations: [matFormFieldAnimations.transitionMessages]
})
export class MultipleInputComponent extends ValueAccessor implements OnInit, AfterViewInit {
  separatorKeysCodes = [ENTER, COMMA];

  // tslint:disable-next-line:no-input-rename
  @Input('items') allItems: string[];

  @Output() added = new EventEmitter<string>();
  @Output() removed = new EventEmitter<number>();

  @ViewChild('itemInput', {static: true}) itemInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: true}) matAutocomplete: MatAutocomplete;

  // tslint:disable-next-line:variable-name
  _value: string[] = [];

  filteredItems: Observable<string[]>;
  // tslint:disable-next-line:variable-name
  private _updateFilteredItems = new Subject();

  transitionState = '';

  constructor(@Optional() ngControl: NgControl, private cdr: ChangeDetectorRef) {
    super(ngControl);
  }

  ngAfterViewInit(): void {
    // Avoid animations on load.
    this.transitionState = 'enter';
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.filteredItems = merge(
      fromEvent(this.itemInput.nativeElement, 'input'),
      this._updateFilteredItems
    ).pipe(
      startWith(null),
      map(() => this._filter(event ? (event.target as HTMLInputElement).value : null))
    );
  }

  remove(itemIndex: number): void {
    this._value.splice(itemIndex, 1);
    this.value = this._value.slice();
    this.removed.emit(itemIndex);
    this._updateFilteredItems.next(null);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.value = this.value ? this.value.concat(value.trim()) : [value.trim()];
      this.added.emit(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this._resetInputValue();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.value = this.value ? this.value.concat(event.option.viewValue) : [event.option.viewValue];
    this.added.emit(event.option.viewValue);
    this._resetInputValue();
  }

  private _filter(value: string | null): string[] {
    return this.allItems?.filter(item =>
      !value || item.toLowerCase().indexOf(value.toLowerCase()) === 0
    );
  }

  private _resetInputValue(): void {
    this.itemInput.nativeElement.value = '';
    this._updateFilteredItems.next(null);
  }
}
