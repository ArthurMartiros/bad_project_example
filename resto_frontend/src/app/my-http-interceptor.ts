import { Injectable, Injector } from '@angular/core';
import { HttpEvent
  , HttpInterceptor
  , HttpHandler
  , HttpRequest
  , HttpResponse
  , HttpErrorResponse } from '@angular/common/http';
import {Observable, of } from 'rxjs';

import {Router} from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import {AuthService} from './auth/auth.service';
@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthService) {}
  intercept(req: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {

     const idToken = this.authService.getToken();
     console.log('IdToken:', idToken);
    if (idToken) {
      const cloned = req.clone({
          headers: req.headers.set('token', idToken)
      });

      return next.handle(cloned);

    } else {
    //  this.router.navigate(['/login', {authorized: 'false'}]);
      return next.handle(req);
    }
  }
}
