import { Injectable } from '@angular/core';
import { CanActivate} from '@angular/router';
import { SessionQuery } from 'src/app/state/session.query';

@Injectable({
  providedIn: 'root'
})
export class ModelotieneperfilGuard implements CanActivate {
  tienePerfil : boolean;
  constructor(private sessionQuery : SessionQuery){}
  canActivate() : boolean{
    this.tienePerfil = this.sessionQuery.getValue().perfil.tienePerfil;
    if(this.tienePerfil){
      return true;
    }
    return false;
  }

}
