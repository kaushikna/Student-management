import { Injectable } from '@angular/core';
import { APIService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends APIService {

  getDashboardFilterData() {
    return this.get(this.API_URL + 'dashboard/getData');
  }
}
