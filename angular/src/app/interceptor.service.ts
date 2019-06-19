import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';
@Injectable()
export class InterceptorService implements HttpInterceptor{
 
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
     //设置跨域cookie
    req = req.clone({
        withCredentials: true
    });
    return next.handle(req);
  } 
}