import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ist',
    pure: false
})
export class MyISTPipe implements PipeTransform {
    transform(timeString: any, type: number): any {
        if (!timeString) {
            return "";
        }
        let hour = 0;
        let minute = 0;


        if (type === 2) {
            hour = timeString.hour;
            minute = timeString.minute;
        } else {
            hour = timeString.split(":")[0];
            minute = timeString.split(":")[1];
        }

        return this.getIndianTime({ hour, minute });
    }

    getIndianTime(time: any) {
        const date = new Date();
        date.setHours(time.hour);
        date.setMinutes(time.minute);
        date.setHours(date.getHours() + 10);
        date.setMinutes(date.getMinutes() + 30);
        return date;
    }
}
