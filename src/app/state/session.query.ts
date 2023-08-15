import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { SessionState, SessionStore } from './session.store';
import jwt_decode, { JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class SessionQuery extends Query<SessionState> {
  constructor(protected store: SessionStore) {
    super(store);
  }

  // Obtiene la decodificacion del token de JWT
  decodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  autenticado$ = this.select((state) => !!state.autenticado);
  perfil$ = this.select((state) => state.perfil);
  userId$ = this.select((state) => state.userId);
  cliente$ = this.select((state) => state.cliente);
  alias$ = this.select((state) => state.perfil.alias);

  get UserId() {
    if (this.getValue().auth?.token) {
      const decoded: JwtPayload = this.decodedAccessToken(
        this.getValue().auth?.token
      );
      return decoded.sub;
    }
  }

  get JWT() {
    return this.getValue().auth?.token;
  }

  get lang() {
    return this.getValue().lang;
  }

  get autenticado() {
    return !!this.getValue().autenticado;
  }
  get GetRoles() {
    if (this.getValue().auth?.token) {
      const decoded = this.decodedAccessToken(this.getValue().auth?.token);
      return decoded.role;
    } else {
      return [];
    }
  }
}
