import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class EventService extends APIService {
  entity = "event/";

  scheduleClass(requestObj): Observable<any> {
    return this.post(this.API_URL + this.entity + 'scheduleClass', requestObj);
  }

  updateClass(requestObj): Observable<any> {
    return this.put(this.API_URL + this.entity + 'updateClass', requestObj);
  }
  getAllBatch(payload, query: any): Observable<any> {
    return this.post(this.API_URL + this.entity + 'getBatches', payload, query);
  }
  getAvailableBatch(query: any): Observable<any> {
    return this.get(this.API_URL + this.entity + 'getAvailableBatches', query);
  }
  getSchedules(query: any): Observable<any> {
    return this.get(this.API_URL + this.entity + 'getClasses', query);
  }
  getAllEvents(): Observable<any> {
    return this.get(this.API_URL + this.entity + 'getSchedules');
  }
  createBatch(requestObj): Observable<any> {
    return this.post(this.API_URL + this.entity + 'createBatch', requestObj);
  }
  updateBatch(requestObj): Observable<any> {
    return this.put(this.API_URL + this.entity + 'updateBatch', requestObj);
  }
  deleteBatch(id: string): Observable<any> {
    return this.delete(this.API_URL + this.entity + 'deleteBatch/' + id);
  }
  getEventMeta(): Observable<any> {
    return this.get(this.API_URL + this.entity + 'getEventMeta');
  }

}
