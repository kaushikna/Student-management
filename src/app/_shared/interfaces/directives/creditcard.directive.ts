import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCreditCard]'
})
export class CreditCardDirective {
  constructor(private eltRef: ElementRef) {

    this.eltRef.nativeElement.addEventListener('input', (event: any) => {
      const x = event.target.value.replace(/\D/g, '').match(/(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/);
      event.target.value = !x[2] ? x[1] : x[1] + '-' + x[2] + (x[3] ? '-' + x[3] + (x[4] ? '-' + x[4] : x[4]) : (x[3]));
    });
  }
}
