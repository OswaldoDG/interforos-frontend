import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';

import {
  Casting,
  CastingClient,
  CastingListElement,
  EstadoCasting,
  TipoRolCliente,
} from 'src/app/services/api/api-promodel';
import { SessionQuery } from 'src/app/state/session.query';
import { ModalEliminarCastingComponent } from '../modal-eliminar-casting/modal-eliminar-casting.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-casting-card-component',
  templateUrl: './casting-card-component.component.html',
  styleUrls: ['./casting-card-component.component.scss'],
})
export class CastingCardComponentComponent implements OnInit {
  @Input() Casting: CastingListElement ;
  @Output() refrescarCast: EventEmitter<string> = new EventEmitter();
  @Output() logoCargado: EventEmitter<boolean> = new EventEmitter();
  urlImage: string;
  valoresdisponibles: any;
  T: any;
  estadoCasting: any;
  nuevoEstado: any;
  esStaff: boolean;
  esRevisor: boolean;
  esAdmin: boolean;
  disable: boolean = true;
  fechaApertura: Date;
  fechaCierre: Date;
  //Modal
  @ViewChild(ModalEliminarCastingComponent) componenteModal;
  constructor(
    private clientApi: CastingClient,
    private translate: TranslateService,
    private toastService: HotToastService,
    private servicio: SessionQuery,
    private spinner: NgxSpinnerService,
    private ruta: Router
  ) {}

  ngOnInit(): void {
    this.translate
      .get([
        'proyectos.casting-estado-ok',
        'proyectos.casting-estado-error',
        'proyectos.casting-estado-EnEdicion',
        'proyectos.casting-estado-Abierto',
        'proyectos.casting-estado-Cerrado',
        'proyectos.casting-estado-Cancelado',
        'proyectos.succes-mensaje-eliminacion',
        'proyectos.error-mensaje-eliminacion',
        'proyectos.succes-estadocast',
        'proyectos.err-estadocast',
        'proyectos.form-compartir-notificacion',
        'proyectos.form-compartir-notificacion-error',
      ])
      .subscribe((ts) => {
        this.T = ts;
        this.estadoCasting =
          this.T['proyectos.casting-estado-' + this.Casting.status];
        this.valoresdisponibles = this.estadoCasting;
      });

    this.validarRol();
  }

  ngAfterViewInit(): void {
    if (this.Casting == null) {
      this.logoCargado.emit(true);
    } else {
      this.clientApi.logoGet(this.Casting.id).subscribe((data) => {
        this.urlImage = data;
        if (data) {
          this.logoCargado.emit(true);
        }
      });
    }
  }

  validarRol() {
    const rol: string = this.servicio.GetRoles;
    if (
      rol == TipoRolCliente.Staff.toLocaleLowerCase() ||
      rol == TipoRolCliente.Administrador.toLocaleLowerCase()
    ) {
      this.esStaff = true;
      this.esAdmin = true;
      this.esRevisor = false;
    } else {
      this.esRevisor = true;
      this.esStaff = false;
      this.esAdmin = false;
    }
  }

  // Auxiliares UI
  recibidoDelModal(r: string) {
    this.spinner.show('load');
    if (r == 'Y') {
      this.clientApi.castingDelete(this.Casting.id).subscribe(
        (e) => {
          this.refrescarCast.emit('Y');
          this.spinner.hide('load');
          this.toastService.success(
            this.T['proyectos.succes-mensaje-eliminacion'],
            {
              position: 'bottom-center',
            }
          );
        },
        (err) => {
          this.spinner.hide('load');
          this.toastService.error(
            this.T['proyectos.error-mensaje-eliminacion'],
            { position: 'bottom-center' }
          );
        }
      );
    }
  }

  confirmar() {
    this.componenteModal.openModal(
      this.componenteModal.myTemplate,
      this.Casting.nombre
    );
  }

  refrescarCasting() {
    this.spinner.show('load');
    this.clientApi.id(this.Casting.id).subscribe((e) => {
      const mapeo: CastingListElement = {
        id: e.id,
        nombre: e.nombre,
        nombreCliente: e.nombreCliente,
        fechaApertura: e.fechaApertura,
        fechaCierre: e.fechaCierre,
        status: e.status,
        aceptaAutoInscripcion: e.aceptaAutoInscripcion,
        activo: e.activo,
        aperturaAutomatica: e.aperturaAutomatica,
        cierreAutomatico: e.cierreAutomatico,
        rol: this.Casting.rol,
      };

      this.Casting = mapeo;
      this.spinner.hide('load');
    });
  }

  cambiarEstado() {
    this.spinner.show('load');
    switch (this.valoresdisponibles) {
      case this.T['proyectos.casting-estado-EnEdicion']:
        this.valoresdisponibles = EstadoCasting.EnEdicion;
        break;
      case this.T['proyectos.casting-estado-Abierto']:
        this.valoresdisponibles = EstadoCasting.Abierto;
        break;
      case this.T['proyectos.casting-estado-Cerrado']:
        this.valoresdisponibles = EstadoCasting.Cerrado;
        break;
      case this.T['proyectos.casting-estado-Cancelado']:
        this.valoresdisponibles = EstadoCasting.Cancelado;
        break;
    }
    this.clientApi
      .estadocasting(this.Casting.id, this.valoresdisponibles)
      .subscribe(
        (e) => {
          this.clientApi.id(this.Casting.id).subscribe((e) => {
            this.spinner.hide('load');
            this.estadoCasting = this.T['proyectos.casting-estado-' + e.status];
            this.toastService.success(this.T['proyectos.succes-estadocast'], {
              position: 'bottom-center',
            });
            this.valoresdisponibles = this.estadoCasting;
            this.disable = true;
            this.refrescarCasting();
            this.refrescarCast.emit('Y');
          });
        },
        (err) => {
          this.toastService.error(this.T['proyectos.err-estadocast'], {
            position: 'bottom-center',
          });
        }
      );
  }

  editarCasting() {
    this.ruta.navigateByUrl('castings/' + this.Casting.id);
  }
  btnActivar() {
    this.disable = false;
  }

  colaborar() {
    this.ruta.navigateByUrl('casting/' + this.Casting.id);
  }

  getLink() {
    var rutaFinal = `${window.location.origin}/casting/${this.Casting.id}`;
    navigator.clipboard
      .writeText(rutaFinal)
      .then(() => {
        this.toastService.success(
          this.T['proyectos.form-compartir-notificacion'],
          {
            position: 'bottom-center',
          }
        );
      })
      .catch((err) => {
        this.toastService.success(
          this.T['proyectos.form-compartir-notificacion-error'],
          {
            position: 'bottom-center',
          }
        );
      });
  }
}
