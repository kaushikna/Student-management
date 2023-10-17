import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class CommonService {

    getDate(date: any) {
        date = date || new Date().toISOString();
        return date.substring(0, 10);
    }

    getCurrentDateInDateInputFormat(date?: any) {
        const today = date ? new Date(date) : new Date();
        let month: any = today.getMonth() + 1;
        let day: any = today.getDate();
        const year = today.getFullYear();

        if (month < 10) {
            month = '0' + month.toString();
        }
        if (day < 10) {
            day = '0' + day.toString();
        }
        return year + '-' + month + '-' + day;
    }
    getTimeFormat(date?: any) {
        const today = date ? new Date(date) : new Date();
        let month: any = today.getMonth() + 1;
        let day: any = today.getDate();
        const year = today.getFullYear();

        if (month < 10) {
            month = '0' + month.toString();
        }
        if (day < 10) {
            day = '0' + day.toString();
        }
        return year + '-' + month + '-' + day;
    }
    GetSortOrder(prop: string) {
        return (a: any, b: any) => a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
    }
    maskPhoneNumber(value: any) {
        const x = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        return !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    }
}
