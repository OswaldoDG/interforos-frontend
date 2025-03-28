import { Injectable } from '@angular/core';
import { ConfiguracionApp } from '../modelos/locales/configuracion-app';
import {
  AceptacionConsentimiento,
  ClienteView,
  InformacionPerfil,
  RespuestaLogin,
} from '../services/api/api-promodel';
import { SessionStore } from './session.store';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  protected decodedToken: { [key: string]: string };
  timerSubscription: Subscription;
  constructor(private sessionStore: SessionStore) {}

  // Obtiene la decodificacion del token de JWT
  decodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
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
    this.decodedToken = jwt_decode(r.token);
    const decoded: JwtPayload = this.decodedAccessToken(r.token);
    sessionStorage.setItem('token', r.token);
    sessionStorage.setItem('userId', decoded.sub);
    sessionStorage.setItem('rolesUsuario', this.decodedToken.role);
    this.sessionStore.update((state) => ({
      auth: r,
      autenticado: true,
    }));
  }
  // Establece cierra sesion
  logOut() {
    sessionStorage.clear();
    this.sessionStore.update((state) => ({
      auth: null,
      autenticado: false,
    }));
  }
  establecePerfil(p: InformacionPerfil) {
    this.sessionStore.update((state) => ({
      perfil: p,
      autenticado: true,
    }));
  }

  actualizarEstadoPerfil(p:InformacionPerfil){

  }

  actualizaIdioma(idioma: string) {
    this.sessionStore.update({ lang: idioma });
  }

  actualizaCliente(cliente: ClienteView) {
    this.sessionStore.update({ cliente: cliente });
  }

  actualizaUserName(alias: string) {
    const p = { ...this.sessionStore.getValue().perfil };
    p.alias = alias;
    this.sessionStore.update({ perfil: p });
  }
  adicionaConsentimiento(aceptacion: AceptacionConsentimiento) {
    if (aceptacion) {
      const p = { ...this.sessionStore.getValue().perfil };
      var cons: AceptacionConsentimiento[] = [...p.cosentimientosAceptados];
      cons.push(aceptacion);
      p.cosentimientosAceptados = cons;
      this.sessionStore.update({ perfil: p });
    }
  }
}
