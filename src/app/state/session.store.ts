import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { ConfiguracionApp } from '../modelos/locales/configuracion-app';
import { ClienteView, InformacionPerfil, RespuestaLogin } from '../services/api/api-promodel';

export interface SessionState {
   appConfig: ConfiguracionApp;
   auth: RespuestaLogin;
   autenticado: boolean;
   perfil: InformacionPerfil;
   lang: string;
   cliente: ClienteView;
   userId: string;
}

export function createInitialState(): SessionState {
  return {
    appConfig: null,
    auth: null,
    autenticado: false,
    perfil: null,
    lang: "es-MX",
    cliente: null,
    userId: null
  };
}



export const sessionPersistStorage = persistState({
  include: ['session'],
  key: 'sessionStore',
});

@Injectable({
    providedIn: 'root'
  })
@StoreConfig({ name: 'session' })
export class SessionStore extends Store<SessionState> {
  constructor() {
    super(createInitialState());
  }
}