import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ModalConfirmacionComponent } from '../modal-confirmacion/modal-confirmacion.component';
import { ModalCambiarPasswordComponent } from '../modal-cambiar-password/modal-cambiar-password.component';
import { TranslateService } from '@ngx-translate/core';
import { SessionService } from 'src/app/state/session.service';
import { SessionQuery } from 'src/app/state/session.query';
import { takeUntil } from 'rxjs/operators';
import { ClienteView, TipoRolCliente } from 'src/app/services/api/api-promodel';
import { Subject } from 'rxjs';
import { ClienteViewVacio } from 'src/app/modelos/entidades-vacias';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HotToastService } from '@ngneat/hot-toast';
import { PersistState } from '@datorama/akita';

@Component({
  selector: 'app-footer-botones',
  templateUrl: './footer-botones.component.html',
  styleUrls: ['./footer-botones.component.scss']
})
export class FooterBotonesComponent implements OnInit {
  private destroy$ = new Subject();
  mobile: boolean = false;
  cliente: ClienteView = ClienteViewVacio();
  auntenticado: boolean = false;
  modelo: boolean = false;
  admin: boolean = false;
  staff: boolean = false;
  revisor: boolean = false;
  agencia: boolean = false;
  userName: string = '';
  T: any[];
  @ViewChild(ModalConfirmacionComponent) componenteModal;
  @ViewChild(ModalCambiarPasswordComponent) componenteModalPassword;
  constructor(
              @Inject('persistStorage') private persistStorage: PersistState[],
              private titleService: Title,
              private toastService: HotToastService,
              private translate: TranslateService,
              private query: SessionQuery,
              private ruta: Router)
  {

  }

  ngOnInit(): void {
    this.translate
      .get([
        'comun.logOut',
        'solicitud.solicitud-cambio-contrasenia',
        'solicitud.solicitud-cambio-contrasenia-error',
        'solicitud.cambiar-contrasena-titulo'
      ])
      .subscribe((trads) => {
        this.T = trads;
      });

    this.query.autenticado$.pipe(takeUntil(this.destroy$)).subscribe((u) => {});

    this.query.cliente$.pipe(takeUntil(this.destroy$)).subscribe((cl) => {
      this.titleService.setTitle(cl.nombre);
      this.cliente = cl;
    });

    this.query.perfil$.pipe(takeUntil(this.destroy$)).subscribe((p) => {
      if (p != null && p != undefined) {
        if (p.roles) {
          this.admin = p.roles.indexOf(TipoRolCliente.Administrador) >= 0;
          this.staff = p.roles.indexOf(TipoRolCliente.Staff) >= 0;
          this.modelo = p.roles.indexOf(TipoRolCliente.Modelo) >= 0;
          this.revisor = p.roles.indexOf(TipoRolCliente.RevisorExterno) >= 0;
          this.agencia = p.roles.indexOf(TipoRolCliente.Agencia) >= 0;
        }
        this.userName = p.alias;
      }
    });
  }

  recibidoDelModalLogOut(r: string) {
    if (r == 'Y') {
      this.persistStorage.forEach((s) => {
        s.clearStore();
      });

      this.ruta.navigateByUrl('/').then(() => {
        window.location.reload();
      });
    }
  }

  recibidoDelModal(r: string) {
    if (r == 'Y') {
      this.toastService.success(
        this.T['solicitud.solicitud-cambio-contrasenia'],
        {
          position: 'bottom-center',
        }
      );
    } else {
      if (r == 'E0') {
        this.toastService.error(
          this.T['solicitud.solicitud-cambio-contrasenia-error'],
          {
            position: 'bottom-center',
          }
        );
      }
    }
  }

  confirmar() {
    this.componenteModal.openModal(
      this.componenteModal.myTemplate,
      this.T['comun.logOut']
    );
  }

  cambiaPassword(){
    this.componenteModalPassword.openModal(
      this.componenteModalPassword.myTemplate
    );
  }

}
