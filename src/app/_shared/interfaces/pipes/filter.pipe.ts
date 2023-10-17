import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'tablefilter',
    pure: false
})
export class MyFilterPipe implements PipeTransform {
    transform(items: any[], filter: any, filterKey: string): any {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => item[filterKey].indexOf(filter) !== -1);
    }
}
