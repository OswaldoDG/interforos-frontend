import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AdminGuard } from './admin-guard';
import { AgenciaGuard } from './agencia-guard';

@Injectable({
  providedIn: 'root',
})
export class PagesAgenciaGuard implements CanActivate {
  constructor(
    private router: Router,
    private admin: AdminGuard,
    private agencia: AgenciaGuard
  ) {}
  canActivate(): boolean {
    if (this.admin.canActivate() || this.agencia.canActivate()) {
      return true;
    } else {
      this.router.navigate(['/401']);
      return false;
    }
  }
}
