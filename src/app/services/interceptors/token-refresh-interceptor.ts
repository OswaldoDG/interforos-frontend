import { HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { SessionQuery } from 'src/app/state/session.query';
import { AccesoClient, RespuestaLogin } from '../api/api-promodel';
import { SessionService } from 'src/app/state/session.service';
import { Router } from '@angular/router';
import { PersistState } from '@datorama/akita';

@Injectable()
export class TokenRefreshInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    private sessionQuery: SessionQuery,
    private accesoClient: AccesoClient,
    private login: SessionService,
    private ruta: Router,
    @Inject('persistStorage') private persistStorage: PersistState[]
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<Object>> {
    let authReq = req;

    const token = this.sessionQuery.getValue().auth?.token;

    if (token != null && token != undefined) {
      authReq = this.addTokenHeader(req, token);
    }
    return next.handle(authReq).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          !authReq.url.includes('acceso/token-refresh') &&
          error.status === 401
        ) {
          return this.handle401Error(authReq, next);
        }
        if (
          error instanceof HttpErrorResponse &&
          authReq.url.includes('acceso/token-refresh') &&
          error.status === 401
        ) {
          this.CerrarSesion();
        }

        return throwError(error);
      })
    );
  }

  private CerrarSesion() {
    this.login.logOut();
    this.ruta.navigateByUrl('/').then(() => {
      window.location.reload();
    });
  }
  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const token = this.sessionQuery.getValue().auth.refreshToken;

      if (token)
        return this.accesoClient.tokenRefresh(token).pipe(
          switchMap((token: RespuestaLogin) => {
            this.isRefreshing = false;

            this.login.loginExitoso(token);
            this.refreshTokenSubject.next(token.token);

            return next.handle(this.addTokenHeader(request, token.token));
          }),
          catchError((err) => {
            this.isRefreshing = false;

            return throwError(err);
          })
        );
    }

    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Accept-Language': this.sessionQuery.lang,
      },
    });
  }
}
