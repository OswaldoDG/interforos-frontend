import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { SessionQuery } from 'src/app/state/session.query';
import { TipoRolCliente } from '../api/api-promodel';

@Injectable({
  providedIn: 'root',
})
export class StaffGuard implements CanActivate {
  roles: string[];
  constructor(sessionQuery: SessionQuery) {
    this.roles = sessionQuery.GetRoles;
  }

  canActivate() {
    if (this.roles.indexOf(TipoRolCliente.Staff.toLowerCase()) >= 0) {
      return true;
    } else {
      return false;
    }
  }
}
