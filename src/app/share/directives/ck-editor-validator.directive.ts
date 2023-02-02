import { Directive, Input  } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { NgForm } from '@angular/forms';
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[ckEditorValidator]',
  providers: [{provide: NG_VALIDATORS, useExisting: CkEditorValidatorDirective, multi: true}]
})
export class CkEditorValidatorDirective implements Validator {
  @Input('ckEditorValidator') form: NgForm;
  constructor() { }
  validate(control: AbstractControl): {[key: string]: any}|null {
    let result=null;
    let hasValue=(control.touched || this.form.submitted) &&  control.hasError('required');

    if (hasValue) {
      result = null;
    } else {
      result = {hasValue:true};
    }

    return result;
  }
}
