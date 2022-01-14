import { AbstractControl, ValidatorFn } from '@angular/forms';

export default class ConfirmedValidator {
    static match(controlName: string, matchingControlName: string): ValidatorFn {
        return (control: AbstractControl) => {
            const originalcontrol = control.get(controlName);
            console.log(originalcontrol?.value);
            const matchingControl = control.get(matchingControlName);
            console.log(matchingControl?.value);

            if (matchingControl?.errors && !matchingControl.errors['matching']) {
                return null;
            }

            if (originalcontrol?.value !== matchingControl?.value) {
                control.get(matchingControlName)?.setErrors({ matching: true });
                return { matching: true };
            }
            else { 
                return null;
            }
        };
    }
}