import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { APIService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class UtilsService extends APIService {
    getStates(query: any): Observable<any> {
        return this.get(this.API_URL + "location/state", query);
    }
    getCities(query: any): Observable<any> {
        return this.get(this.API_URL + "location/city", query);
    }
}
