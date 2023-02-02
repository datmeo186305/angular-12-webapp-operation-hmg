import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTypeMaxLength]',
})
export class TypeMaxLengthDirective {
  constructor(el: ElementRef, renderer: Renderer2) {
    // Use renderer to render the element with styles
    el.nativeElement.addEventListener('keyPress', () => {
      if (el.nativeElement.value.length > 256) return false;
    });

    el.nativeElement.addEventListener('input', () => {
      if (el.nativeElement.value.length > el.nativeElement.maxLength)
        el.nativeElement.value.setValue(
          el.nativeElement.value.slice(0, el.nativeElement.maxLength)
        );
    });
  }
}
