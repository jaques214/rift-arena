import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const today = Date.now();
    const date = new Date(control.value);

    // if there's no control or no value, that's ok
    if (!control.value) return null;

    // return null if there's no errors
    return date.getTime() < today ? { invalidDate: 'You cannot use past dates' } : null;
  };
}
