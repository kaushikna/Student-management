import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class UserService extends APIService {
    entity = "user/";

    getProfile(): Observable<any> {
        return this.get(this.API_URL + this.entity + 'profile');
    }

    updateProfile(requestObj): Observable<any> {
        return this.put(this.API_URL + this.entity + 'profile', requestObj);
    }
}
