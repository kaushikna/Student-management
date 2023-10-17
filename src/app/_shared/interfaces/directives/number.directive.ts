import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
    selector: '[appNumbersOnly]'
})
export class NumbersOnlyDirective {

    private regex: RegExp = new RegExp('^[1-9]\\d*$');
    private specialKeys: Array<string> = ['Backspace', 'Tab'];

    constructor(private el: ElementRef) {
    }
    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }
        const current: string = this.el.nativeElement.value;
        const next: string = current.concat(event.key);
        if (next && !String(next).match(this.regex)) {
            event.preventDefault();
        }
    }
}