import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { APIService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService extends APIService {
  entity = "student/";

  addStudent(requestObj): Observable<any> {
    return this.post(this.API_URL + this.entity + 'addStudent', requestObj);
  }
  updateStudent(requestObj): Observable<any> {
    return this.put(this.API_URL + this.entity + 'updateStudent', requestObj);
  }
  getBatches(): Observable<any> {
    return this.get(this.API_URL + this.entity + 'getBatches');
  }

  getAllStudents(query: any): Observable<any> {
    return this.get(this.API_URL + this.entity + 'getStudents', query);
  }
  getStudentList(params?: any): Observable<any> {
    return this.get(this.API_URL + this.entity + 'getStudentList', params || {});
  }
  filterByEmail(email): Observable<any> {
    return this.get(this.API_URL + this.entity + 'filterByEmail/' + email);
  }

  deleteStudent(id): Observable<any> {
    return this.delete(this.API_URL + this.entity + 'deleteStudent/' + id);
  }
}
