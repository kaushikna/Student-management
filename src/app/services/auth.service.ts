import { Injectable } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { User } from '../Models/user';
import { APIService } from './api.service';
import { Role } from '../Models';



@Injectable({
  providedIn: 'root'
})

export class AuthService extends APIService {

  register(user: any, captchaToken: string): Observable<any> {
    return this.post(this.API_URL + 'auth/signup', user, { captchaToken }).pipe(
      catchError(this.handleError)
    );
  }

  upload(key: string, file: any, entity?: string): Observable<any> {
    const fd = new FormData();
    fd.append(key, file);
    fd.append("fileType", entity || "profile");
    return this.httpClient.post(this.API_URL + 'auth/uploadFile', fd);
  }

  login(user: User) {
    return this.httpClient.post<any[]>(this.API_URL + 'auth/signin', user);
  }

  forgotPassword(user: any) {
    return this.httpClient.post<any[]>(this.API_URL + 'user/resetPassword', user);
  }

  verify(params: any) {
    return this.httpClient.get<any[]>(this.API_URL + 'user/verifyEmail', { params });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  validateReCaptchaToken(token: string): Observable<any> {
    return this.httpClient.post<any>(this.API_URL + 'captcha/validateToken', { recaptcha: token }).pipe(
      catchError(this.handleError)
    );
  }

  getAccessToken() {
    return localStorage.getItem('access_token');
  }
  getUser() {
    const roleRouteMap = {
      admin:  Role.ADMIN,
      student: "smart-student",
      tutor: "smart-tutor",
    };

    const userString = localStorage.getItem('currentUser');
    if (userString) {
      const user = JSON.parse(userString);
      user.route = roleRouteMap[user.role];
      return user;
    }
    return {};
  }


  isLoggedIn() {
    return !!localStorage.getItem('access_token');
  }

  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent || error.error.message) {
      msg = error.error.message;
    } else {
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}
