import { AbstractControl, ValidatorFn } from '@angular/forms';
import { User } from './models/user';

export default class ConfirmedValidator {
    static match(controlName: string, matchingControlName: string): ValidatorFn {
        return (control: AbstractControl) => {
            const originalcontrol = control.get(controlName);
            //console.log(originalcontrol?.value);
            const matchingControl = control.get(matchingControlName);
            //console.log(matchingControl?.value);

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

    static matchUser(controlName: string, users: User[]): ValidatorFn {
        return (control: AbstractControl) => {
            const originalcontrol = control.get(controlName);

            console.log(users);

            if(users.includes(originalcontrol?.value)) {
                console.log(users.includes(originalcontrol?.value));
                return null;
            }
            else {
                console.log(originalcontrol?.value);
                control.get(controlName)?.setErrors({ matching: true });
                return { matching: true };
            }
        };
    }
}