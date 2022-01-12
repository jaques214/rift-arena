import { AbstractControl, ValidatorFn } from '@angular/forms';

export function ConfirmedValidator(controlName: string, matchingControlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const originalcontrol = control.get(controlName)?.value;
        //console.log(controlName);
        const matchingControl = control.value;
        //console.log(matchingControl);

        if (control.get(controlName)?.errors && !control.get(matchingControlName)?.errors?.['confirmedValidator']) {
            return null;
        }

        return (originalcontrol !== matchingControl)
      ? { confirmedValidator: true }
      : null;
    }
}