import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { AuthService } from "../services/auth.service";

import 'rxjs/add/operator/do';
import { Observable } from "rxjs";
import { ToastrService } from 'ngx-toastr';




@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private toastr: ToastrService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.authService.getAccessToken();
    if (accessToken != null) {
      req = req.clone({
        setHeaders: {
          Authorization: accessToken
        },
      });
    }

    return next.handle(req).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if ((err.status === 401 || err.status === 403) && !err.url.includes("auth")) {
          this.toastr.error(err.error.message, 'Unauthorized!', {
            timeOut: 3000
          });
          this.authService.logout();
        }
      }
    });
  }
}
