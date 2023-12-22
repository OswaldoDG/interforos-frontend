import { PersistState } from '@datorama/akita';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { first, takeUntil } from 'rxjs/operators';
import {
  AccesoClient,
  ClienteView,
  PersonaClient,
  RegistroClient,
  TipoRolCliente,
} from 'src/app/services/api/api-promodel';
import { SessionQuery } from 'src/app/state/session.query';
import { SessionService } from 'src/app/state/session.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Title } from '@angular/platform-browser';
import { ClienteViewVacio } from 'src/app/modelos/entidades-vacias';
import { ModalCambiarPasswordComponent } from '../modal-cambiar-password/modal-cambiar-password.component';
@Component({
  selector: 'app-navbar-staff',
  templateUrl: './navbar-staff.component.html',
  styleUrls: ['./navbar-staff.component.scss'],
})
export class NavbarStaffComponent implements OnInit {
  @ViewChild(ModalCambiarPasswordComponent) componenteModal;
  private destroy$ = new Subject();
  mobile: boolean = false;
  cliente: ClienteView = ClienteViewVacio();
  auntenticado: boolean = false;
  modelo: boolean = false;
  admin: boolean = false;
  staff: boolean = false;
  agencia: boolean = false;
  userName: string = '';
  T: any[];

  constructor(
    @Inject('persistStorage') private persistStorage: PersistState[],
    private titleService: Title,
    private bks: BreakpointObserver,
    private router: Router,
    private query: SessionQuery,
    private session: SessionService,
    private registro: RegistroClient,
    private acceso: AccesoClient,
    private persona: PersonaClient,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private toastService: HotToastService
  ) {}

  ngOnInit(): void {
    this.bks
      .observe(['(min-width: 500px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.mobile = false;
        } else {
          this.mobile = true;
        }
      });

    this.translate
      .get([
        'navbar-staff.mi-cuenta',
        'navbar-staff.salir',
        'navbar-staff.inicio',
        'solicitud.solicitud-cambio-contrasenia',
        'solicitud.solicitud-cambio-contrasenia-error',
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
          this.agencia = p.roles.indexOf(TipoRolCliente.Agencia) >= 0;
        }
        this.userName = p.alias;
      }
    });
  }
  //confirma  el remover un comentario
  confirmar() {
    this.componenteModal.openModal(this.componenteModal.myTemplate);
  }

  navegarRoot(){
    this.router.navigateByUrl("/");
  }
  // Auxiliares UI
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
}
