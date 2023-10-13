import { Injectable } from '@angular/core';
import { CanActivate} from '@angular/router';
import { SessionQuery } from 'src/app/state/session.query';
import { AgenciaGuard } from './agencia-guard';

@Injectable({
  providedIn: 'root'
})
export class ModelotieneperfilGuard implements CanActivate {
  tienePerfil : boolean;
  constructor(private sessionQuery : SessionQuery, private agencia:AgenciaGuard){}
  canActivate() : boolean{
    this.tienePerfil = this.sessionQuery.getValue().perfil.tienePerfil;
    if(this.tienePerfil || this.agencia.canActivate()){
      return true;
    }
    return false;
  }

}
