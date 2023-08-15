import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionQuery } from 'src/app/state/session.query';
import { TipoRolCliente } from '../api/api-promodel';

@Injectable({
  providedIn: 'root',
})
export class ModeloGuard implements CanActivate {
  roles: string[];
  constructor(sessionQuery: SessionQuery, private router: Router) {
    this.roles = sessionQuery.GetRoles;
  }

  canActivate(): boolean {
    if (this.roles.indexOf(TipoRolCliente.Modelo.toLowerCase()) >= 0) {
      return true;
    } else {
      this.router.navigate(['/401']);
      return false;
    }
  }
}
