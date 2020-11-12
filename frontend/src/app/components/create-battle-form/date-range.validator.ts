import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const DateRangeValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const startDate = control.get('startDate');
  const endDate = control.get('endDate');

  return startDate && endDate && startDate.value < endDate.value
    ? null
    : {dateRange: 'Start date must be less than end date'};
};
