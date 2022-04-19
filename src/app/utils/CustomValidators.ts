import { AbstractControl, ValidatorFn } from '@angular/forms';
export class CustomValidators {

  static match(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);

      // @ts-ignore
      if (checkControl.errors && !checkControl.errors.matching) {
        return null;
      }
      // @ts-ignore
      if (control.value !== checkControl.value) {
        // @ts-ignore
        controls.get(checkControlName).setErrors({ matching: true });
        return { matching: true };
      } else {
        return null;
      }
    };
  }
}
