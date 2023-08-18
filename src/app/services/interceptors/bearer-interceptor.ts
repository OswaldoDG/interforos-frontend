import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionQuery } from 'src/app/state/session.query';
import { catchError } from 'rxjs/operators';

@Injectable()
export class BearerInterceptor implements HttpInterceptor {
  constructor(private session: SessionQuery) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(this.addAuthToken(request));
  }

  addAuthToken(request: HttpRequest<any>) {
    const token = this.session.JWT;
    if (token) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Accept-Language': this.session.lang,
        },
      });
    } else {
      return request;
    }
  }
}
