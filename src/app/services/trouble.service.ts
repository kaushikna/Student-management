import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { APIService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class TroubleService extends APIService {
    entity = "ticket/";
    getTickets(query: any): Observable<any> {
        return this.get(this.API_URL + this.entity, query);
    }
    addTicket(payload: any): Observable<any> {
        return this.post(this.API_URL + this.entity, payload);
    }
    updateTicket(payload: any): Observable<any> {
        return this.put(this.API_URL + this.entity + "/" + payload._id, payload);
    }
}
