import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';
import { Observable } from "rxjs";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {  
    public cookie = ""
    constructor(public auth: AuthenticationService) {
    
}  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    request = request.clone({
      setHeaders: {
        'X_CSRFToken': this.cookie
      }
    });    return next.handle(request);
  }
}