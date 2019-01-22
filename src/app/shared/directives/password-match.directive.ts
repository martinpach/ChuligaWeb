import { Directive } from '@angular/core';
import { Validator, NG_VALIDATORS, ValidationErrors, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appPasswordMatch]',
  providers: [{ provide: NG_VALIDATORS, useExisting: PasswordMatchDirective, multi: true }]
})
export class PasswordMatchDirective implements Validator {
  validate(control: AbstractControl): { [key: string]: any } | null {
    const result = this.match(control);
    return result;
  }

  match(control: AbstractControl): ValidationErrors | null {
    const password = control.parent.get('password');

    return password && control.value && password.value !== control.value ? { passwordMatch: false } : null;
  }
}
