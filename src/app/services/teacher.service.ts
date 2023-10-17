import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { APIService } from './api.service';



@Injectable({
  providedIn: 'root'
})
export class TeacherService extends APIService {
  entity = "teacher/";

  getTeachers(query: any): Observable<any> {
    return this.get(this.API_URL + this.entity + 'getTeachers', query);
  }
  addTeacher(requestObj): Observable<any> {
    return this.post(this.API_URL + this.entity + 'addTeacher', requestObj);
  }

  deleteTeacher(id): Observable<any> {
    return this.delete(this.API_URL + this.entity + 'deleteTeacher/' + id);
  }

  updateTeacher(requestObj): Observable<any> {
    return this.put(this.API_URL + this.entity + 'updateTeacher', requestObj);
  }
  filterByEmail(email): Observable<any> {
    return this.get(this.API_URL + this.entity + 'filterByEmail/' + email);
  }
  getAvailableTeachers(payload: any): Observable<any> {
    return this.post(this.API_URL + this.entity + 'availableTeachers', payload);
  }
}
