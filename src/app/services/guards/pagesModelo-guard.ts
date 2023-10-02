import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AdminGuard } from './admin-guard';
import { ModeloGuard } from './modelo-guard';
import { SessionQuery } from 'src/app/state/session.query';
import { ModelotieneperfilGuard } from './modelotieneperfil-guard';
import { TranslateService } from '@ngx-translate/core';
import { HotToastService } from '@ngneat/hot-toast';

@Injectable({
  providedIn: 'root',
})
export class PagesModeloGuard implements CanActivate {
  roles: string[];
  tienePerfil: boolean;
  private T: any;
  constructor(
    private router: Router,
    private modelo: ModeloGuard,
    private admin: AdminGuard,
    private modeloPerfil: ModelotieneperfilGuard,
    private sessionQuery: SessionQuery,
    private translate: TranslateService,
    private toastService: HotToastService
  ) {
    this.tienePerfil = this.sessionQuery.getValue().perfil.tienePerfil;
    this.translate
      .get(['modelo.perfil-validacion-mensaje-guard'])
      .subscribe((ts) => {
        this.T = ts;
      });
  }

  canActivate(): boolean {
    if (this.modelo.canActivate() || this.admin.canActivate()) {
      if (this.modeloPerfil.canActivate()) {
        return true;
      } else {
        this.router.navigateByUrl('/perfil');
        this.toastService.warning(
          this.T['modelo.perfil-validacion-mensaje-guard'],
          {
            position: 'top-center',
          }
        );
      }
    } else {
      this.router.navigate(['/401']);
      return false;
    }
  }
}
