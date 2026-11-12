import type { AbstractControl, ValidatorFn } from '@angular/forms';

export const match = (controlName: string, matchingControlName: string): ValidatorFn => {
  return (control: AbstractControl) => {
    const originalcontrol = control.get(controlName);
    const matchingControl = control.get(matchingControlName);

    if (matchingControl?.errors && !matchingControl.errors['matching']) {
      return null;
    }

    if (originalcontrol?.value !== matchingControl?.value) {
      control.get(matchingControlName)?.setErrors({ matching: true });
      return { matching: true };
    } else {
      return null;
    }
  };
};

export const matchUser = (controlName: string, users: string[]): ValidatorFn => {
  return (control: AbstractControl) => {
    const originalcontrol = control.get(controlName);

    if (users.includes(<string>originalcontrol?.value)) {
      return null;
    } else {
      control.get(controlName)?.setErrors({ matching: true });
      return { matching: true };
    }
  };
};
