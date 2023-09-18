import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AdminGuard } from './admin-guard';
import { StaffGuard } from './staff-guard';

@Injectable({
  providedIn: 'root',
})
export class PagesStaffGuard implements CanActivate {
  roles: string[];
  constructor(
    private router: Router,
    private staff: StaffGuard,
    private admin: AdminGuard
  ) {}

  canActivate(): boolean {
    if (this.staff.canActivate() || this.admin.canActivate()) {
      return true;
    } else {
      this.router.navigate(['/401']);
      return false;
    }
  }
}
