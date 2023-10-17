import { Directive, ElementRef } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Directive({
  selector: '[appPhone]'
})
export class PhoneDirective {
  constructor(private eltRef: ElementRef, private commonService: CommonService) {

    this.eltRef.nativeElement.addEventListener('input', (event: any) => {
      event.target.value = this.commonService.maskPhoneNumber(event.target.value);
    });
  }
}
