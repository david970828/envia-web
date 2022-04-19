import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import {environment} from "../../environments/environment";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url === environment.apiCountry) {
      return next.handle(req);
    }
    const idToken = sessionStorage.getItem("tk");
    if (idToken) {
      const cloned = req.clone({ headers: req.headers.set("Authorization", "Bearer " + idToken)});
      return next.handle(cloned);
    }
    else {
      return next.handle(req);
    }
  }
}
