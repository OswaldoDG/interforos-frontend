import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { SessionState, SessionStore } from './session.store';

@Injectable({
  providedIn: 'root'
})
export class SessionQuery extends Query<SessionState> {

  constructor(protected store: SessionStore) {
    super(store);
  }

  
  autenticado$ = this.select(state => !!state.autenticado);
  perfil$ = this.select(state => state.perfil);
  userId$ = this.select(state => state.userId);
  cliente$ = this.select(state => state.cliente);
  alias$ = this.select(state => state.perfil.alias);

  get JWT() {
    return this.getValue().auth?.token;
  }

  get lang() {
    return this.getValue().lang;
  }

  get autenticado() {
    return !!this.getValue().autenticado;
  }
}