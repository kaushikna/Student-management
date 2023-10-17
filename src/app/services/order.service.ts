import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { APIService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class OrderService extends APIService {
    entity = "order/";
    getOrders(query?: any): Observable<any> {
        return this.get(this.API_URL + this.entity + 'getUserOrders', query);
    }
    getTransactions(query?: any): Observable<any> {
        return this.get(this.API_URL  + 'transaction', query);
    }
}
