

import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { APIService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class PaymentService extends APIService {
    verifyCoupon(query?: any): Observable<any> {
        return this.get(this.API_URL + 'offer/discountAmount', query);
    }
    makePayment(payload: any, query?: any): Observable<any> {
        return this.post(this.API_URL + 'payments/chargeCreditCard', payload, query);
    }
}
