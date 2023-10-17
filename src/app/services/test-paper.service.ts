import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APIService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class TestPaperService extends APIService {
  entity = "test/";
  entity2 = "testpaper/";
  getTest(url: string) {
    return this.get(this.API_URL + "getTestById/" + url);
  }

  getAll(): Observable<any> {
    return this.get(this.API_URL + "getAllTests/");
  }

  getTestpaperTypes(): Observable<any> {
    return this.get(this.API_URL + this.entity + "getTestpaperTypes");
  }

  addTest(requestObj): Observable<any> {
    return this.post(this.API_URL + "addTest", requestObj);
  }
  addSubject(requestObj): Observable<any> {
    return this.post(this.API_URL + this.entity + "subject", requestObj);
  }
  deleteSubject(payload): Observable<any> {
    return this.delete(this.API_URL + this.entity + "subject/" + payload._id);
  }
  // editSubject(updateObj): Observable<any> {
  //   return this.post(this.API_URL + "subject/update", updateObj);
  // }
  getAllSubject(query?: any): Observable<any> {
    return this.get(this.API_URL + "test/subject", query);
  }
  getAllSubjectsPublic(query?: any): Observable<any> {
    return this.get(this.API_URL + "public/subject", query);
  }
  getSubject(id): Observable<any> {
    return this.get(this.API_URL + "subject/" + id);
  }
  addPaper(requestObj): Observable<any> {
    return this.post(this.API_URL + this.entity + "paper", requestObj);
  }
  updatePaper(updateObj): Observable<any> {
    return this.post(this.API_URL + this.entity + "paper/update", updateObj);
  }
  getAllPaper(query?: any): Observable<any> {
    return this.get(this.API_URL + this.entity + "paper", query);
  }
  getAllPapersAssigned(payload: any, query?: any): Observable<any> {
    return this.post(
      this.API_URL + this.entity + "getPapersWithBatches",
      payload,
      query
    );
  }
  getAllPaperForStudent(): Observable<any> {
    return this.get(this.API_URL + this.entity + "getAllPaperForStudent");
  }
  getPaper(id): Observable<any> {
    return this.get(this.API_URL + this.entity + "paper/" + id);
  }
  addQuestions(requestObj): Observable<any> {
    return this.post(this.API_URL + this.entity + "questions", requestObj);
  }
  getAllQuestions(id): Observable<any> {
    return this.get(this.API_URL + this.entity + "questions/" + id);
  }
  getQuestions(data: any, query?: any): Observable<any> {
    return this.post(this.API_URL + this.entity + "questions/get", data, query);
  }
  getAllQuestionsPopulate(id): Observable<any> {
    return this.get(this.API_URL + this.entity + "questions/paperid/" + id);
  }
  getresultById(data): Observable<any> {
    return this.post(this.API_URL + this.entity + "result/filter", data);
  }
  saveresult(data): Observable<any> {
    return this.post(this.API_URL + this.entity + "result", data);
  }
  getStudentBySearchQuery(data): Observable<any> {
    return this.post(
      this.API_URL + this.entity + "getStudentBySearchQuery",
      data
    );
  }
  addStudentOrBatchToTestPaper(data): Observable<any> {
    return this.post(
      this.API_URL + this.entity + "addStudentOrBatchToTestPaper",
      data
    );
  }

  removeStudentOrBatchFromTestPaper(data): Observable<any> {
    return this.post(
      this.API_URL + this.entity + "removeStudentOrBatchFromTestPaper",
      data
    );
  }

  changeTestPaperDisabledStatus(data): Observable<any> {
    return this.post(
      this.API_URL + this.entity + "changeTestPaperDisabledStatus",
      data
    );
  }
  deleteTestpaper(id: string): Observable<any> {
    return this.delete(this.API_URL + this.entity + id);
  }

  getAllAttemptCountByPaperId(data): Observable<any> {
    return this.post(
      this.API_URL + this.entity + "getAllAttemptCountByPaperId",
      data
    );
  }

  getAttemptedUsers(id): Observable<any> {
    return this.get(this.API_URL + this.entity + "paper/attempted/" + id);
  }

  getTestPaperTypes(): Observable<any> {
    return this.get(this.API_URL + this.entity2 + "getTestpaperTypes");
  }

  getSubjects(): Observable<any> {
    return this.get(this.API_URL + this.entity2 + "getSubjects");
  }

  getStudents(): Observable<any> {
    return this.get(this.API_URL + this.entity2 + "getStudents");
  }

  getTestResults(query: any): Observable<any> {
    return this.get(this.API_URL + this.entity2 + "getResults", query);
  }

  getTestResultById(id: string): Observable<any> {
    return this.get(this.API_URL + this.entity2 + "getResults/" + id);
  }
}
