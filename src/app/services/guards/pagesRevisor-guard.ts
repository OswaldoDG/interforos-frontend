import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AdminGuard } from './admin-guard';
import { StaffGuard } from './staff-guard';
import { RevisorGuard } from './revisor-guard';

@Injectable({
  providedIn: 'root',
})
export class PagesRevisorGuard implements CanActivate {
  roles: string[];
  constructor(
    private router: Router,
    private staff: StaffGuard,
    private admin: AdminGuard,
    private revisor: RevisorGuard
  ) {}

  canActivate(): boolean {
    if (
      this.staff.canActivate() ||
      this.admin.canActivate() ||
      this.revisor.canActivate()
    ) {
      return true;
    } else {
      this.router.navigate(['/401']);
      return false;
    }
  }
}
