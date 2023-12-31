import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AdminGuard } from './admin-guard';
import { StaffGuard } from './staff-guard';
import { RevisorGuard } from './revisor-guard';
import { AgenciaGuard } from './agencia-guard';

@Injectable({
  providedIn: 'root',
})
export class PagesStaffGuard implements CanActivate {
  roles: string[];
  constructor(
    private router: Router,
    private staff: StaffGuard,
    private admin: AdminGuard,
    private revisor: RevisorGuard,
    private agencia: AgenciaGuard
  ) {}

  canActivate(): boolean {
    if (
      this.staff.canActivate() ||
      this.admin.canActivate() ||
      this.revisor.canActivate() ||
      this.agencia.canActivate()
    ) {
      return true;
    } else {
      this.router.navigate(['/401']);
      return false;
    }
  }
}
