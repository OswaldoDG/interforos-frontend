import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { SessionQuery } from 'src/app/state/session.query';
import { TipoRolCliente } from '../api/api-promodel';

@Injectable({
  providedIn: 'root',
})
export class RevisorGuard implements CanActivate {
  roles: string[];
  constructor(sessionQuery: SessionQuery) {
    this.roles = sessionQuery.GetRoles;
  }

  canActivate(): boolean {
    if (this.roles.indexOf(TipoRolCliente.RevisorExterno.toLowerCase()) >= 0) {
      return true;
    } else {
      return false;
    }
  }
}
