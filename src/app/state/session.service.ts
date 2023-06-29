import { Injectable } from '@angular/core';
import { ConfiguracionApp } from '../modelos/locales/configuracion-app';
import {
  ClienteView,
  InformacionPerfil,
  RespuestaLogin,
} from '../services/api/api-promodel';
import { SessionStore } from './session.store';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor(private sessionStore: SessionStore) {}

  // Actualiza la configuración del cliente
  updateConfig(config: ConfiguracionApp) {
    this.sessionStore.update((state) => ({
      appConfig: config,
    }));
  }

  // Establece los datos de sesión tras el login exitoso
  loginExitoso(r: RespuestaLogin) {
    sessionStorage.setItem('token', r.token);
    this.sessionStore.update((state) => ({
      auth: r,
      autenticado: true,
    }));
  }

  establecePerfil(p: InformacionPerfil) {
    this.sessionStore.update((state) => ({
      perfil: p,
      autenticado: true,
    }));
  }

  actualizaCliente(cliente: ClienteView) {
    this.sessionStore.update({ cliente: cliente });
  }

  actualizaUserName(alias: string) {
    const p = { ...this.sessionStore.getValue().perfil };
    p.alias = alias;
    this.sessionStore.update({ perfil: p });
  }
}
