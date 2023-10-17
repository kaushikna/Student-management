

import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { APIService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class ResourceService extends APIService {
    addResource(payload: any, query?: any): Observable<any> {
        return this.post(this.API_URL + 'resource', payload, query);
    }
    editResource(payload: any, query?: any): Observable<any> {
        return this.put(this.API_URL + 'resource/' + payload._id, payload, query);
    }
    addChapter(payload: any, query?: any): Observable<any> {
        return this.post(this.API_URL + 'resource/chapter', payload, query);
    }
    addLesson(payload: any, query?: any): Observable<any> {
        return this.post(this.API_URL + 'resource/chapter/lesson', payload, query);
    }
    addQuiz(payload: any, query?: any): Observable<any> {
        return this.post(this.API_URL + 'resource/chapter/quiz', payload, query);
    }
    editChapter(payload: any, query?: any): Observable<any> {
        return this.put(this.API_URL + 'resource/chapter/' + payload._id, payload, query);
    }
    editLesson(payload: any, query?: any): Observable<any> {
        return this.put(this.API_URL + 'resource/chapter/lesson/' + payload._id, payload, query);
    }
    editQuiz(payload: any, query?: any): Observable<any> {
        return this.put(this.API_URL + 'resource/chapter/quiz/' + payload._id, payload, query);
    }
    deleteResource(payload: any): Observable<any> {
        return this.delete(this.API_URL + 'resource/' + payload._id);
    }
    deleteChapter(payload: any): Observable<any> {
        return this.delete(this.API_URL + 'resource/chapter/' + payload._id);
    }
    deleteLesson(payload: any): Observable<any> {
        return this.delete(this.API_URL + 'resource/chapter/lesson/' + payload._id);
    }
    deleteQuiz(payload: any): Observable<any> {
        return this.delete(this.API_URL + 'resource/chapter/quiz/' + payload._id);
    }
    getAllResources(query?: any): Observable<any> {
        return this.get(this.API_URL + 'resource', query);
    }
    getResource(id: string): Observable<any> {
        return this.get(this.API_URL + 'resource/' + id);
    }
    getResourceLessons(id: string): Observable<any> {
        return this.get(this.API_URL + 'resource/chapter/' + id + '/lesson');
    }
    getResourceQuiz(id: string): Observable<any> {
        return this.get(this.API_URL + 'resource/chapter/quiz/' + id );
    }
}
