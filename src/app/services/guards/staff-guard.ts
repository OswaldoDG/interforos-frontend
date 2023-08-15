import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionQuery } from 'src/app/state/session.query';
import { TipoRolCliente } from '../api/api-promodel';

@Injectable({
  providedIn: 'root',
})
export class StaffGuard implements CanActivate {
  roles: string[];
  constructor(sessionQuery: SessionQuery, private router: Router) {
    this.roles = sessionQuery.GetRoles;
  }

  canActivate() {
    if (this.roles.indexOf(TipoRolCliente.Staff.toLowerCase()) >= 0) {
      return true;
    } else {
      this.router.navigate(['/401']);
      return false;
    }
  }
}
