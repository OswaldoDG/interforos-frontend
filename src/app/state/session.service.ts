import { Injectable } from '@angular/core';
import { ConfiguracionApp } from '../modelos/locales/configuracion-app';
import {
  ClienteView,
  InformacionPerfil,
  RespuestaLogin,
} from '../services/api/api-promodel';
import { SessionStore } from './session.store';
import jwt_decode, { JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor(private sessionStore: SessionStore) {}

  // Obtiene la decodificacion del token de JWT
  decodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch(Error) {
      return null;
    }
  }

  // Actualiza la configuración del cliente
  updateConfig(config: ConfiguracionApp) {
    this.sessionStore.update((state) => ({
      appConfig: config,
    }));
  }

  // Establece los datos de sesión tras el login exitoso
  loginExitoso(r: RespuestaLogin) {
    
    const decoded: JwtPayload = this.decodedAccessToken(r.token)
    sessionStorage.setItem('token', r.token);
    sessionStorage.setItem('userId', decoded.sub);

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
