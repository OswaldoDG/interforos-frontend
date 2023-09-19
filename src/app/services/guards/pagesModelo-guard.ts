import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AdminGuard } from './admin-guard';
import { ModeloGuard } from './modelo-guard';

@Injectable({
  providedIn: 'root',
})
export class PagesModeloGuard implements CanActivate {
  roles: string[];
  constructor(
    private router: Router,
    private modelo: ModeloGuard,
    private admin: AdminGuard
  ) {}

  canActivate(): boolean {
    if (this.modelo.canActivate() || this.admin.canActivate()) {
      return true;
    } else {
      this.router.navigate(['/401']);
      return false;
    }
  }
}
