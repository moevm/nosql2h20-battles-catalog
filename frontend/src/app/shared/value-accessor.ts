// tslint:disable:no-any directive-class-suffix

import { noop } from 'rxjs';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Directive, Input } from '@angular/core';

@Directive({selector: '[appValueAccessor]'})
export class ValueAccessor implements ControlValueAccessor {
  @Input() disabled: boolean;

  onTouch: () => void = noop;
  // tslint:disable-next-line:no-any
  protected onChange: (value: any) => void = noop;

  // tslint:disable-next-line: variable-name
  protected _value: any = '';
  @Input()
  get value(): any { return this._value; }
  set value(v: any) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }

  constructor(public ngControl: NgControl) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  writeValue(value: any): void {
    if (value !== this._value) {
      this._value = value;
    }
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
