import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})

export class APIService {
  public API_URL = environment.apiUrl + 'smartAct/';
  public headers = new HttpHeaders().set('Content-Type', 'application/json').set('x-access-token', 'this.getAccessToken');
  constructor(public httpClient: HttpClient, public router: Router) { }
  request(method, url, body, headers, params) {
    return this.httpClient.request(method, url, {
      body: body || {},
      headers: headers || {},
      params: params || {}
    });
  }

  get(url, params?): Observable<any> {
    return this.request('get', url, {}, this.headers, params);
  }

  post(url, data, params?): Observable<any> {
    return this.request('post', url, data, this.headers, params);
  }

  put(url, data, params?): Observable<any> {
    return this.request('put', url, data, this.headers, params);
  }

  delete(url, data?, params?): Observable<any> {
    return this.request('delete', url, data, this.headers, params);
  }

}
