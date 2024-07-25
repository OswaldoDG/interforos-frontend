import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  CastingClient,
  PermisosCasting,
  PersonaClient,
  SelectorCastingCategoria,
  SelectorCategoria,
  TipoRolCliente,
} from 'src/app/services/api/api-promodel';
import { CastingStaffServiceService } from 'src/app/services/casting-staff-service.service';
import { SessionQuery } from 'src/app/state/session.query';
import { ModalConfirmacionComponent } from '../../common/modal-confirmacion/modal-confirmacion.component';
import {
  CastingReviewService,
  ModeloCategoria,
} from 'src/app/services/casting-review.service';
import { DownloadExcelService } from 'src/app/services/Files/download-excel.service';
@Component({
  selector: 'app-castig-review',
  templateUrl: './castig-review.component.html',
  styleUrls: ['./castig-review.component.scss'],
  providers: [CastingStaffServiceService, CastingReviewService],
})
export class CastigReviewComponent implements OnInit {
  @ViewChild(ModalConfirmacionComponent) componenteModal;
  castingId: string = null;
  public diaActual: number = 0;
  dias: number[] = [];
  casting: SelectorCastingCategoria;
  personasDesplegables: ModeloCategoria[] = [];
  categorias: SelectorCategoria[] = [];
  dVertical: boolean = false;
  tBusqueda: boolean = false;
  hayCategorias: boolean = false;
  estadoPersona: boolean = true;
  puedeAgregarModelo: boolean = true;
  categoriaSeleccionada: boolean = false;
  CategoriaActual: string;
  EsAnonimo: boolean = false;
  T: any;
  formAgregarModelo: FormGroup;
  permisosCast: PermisosCasting = {
    verRedesSociales: true,
    verTelefono: true,
    verDireccion: true,
    verEmail: true,
    verHabilidades: true,
    verDatosGenerales: true,
    verGaleriaPersonal: true,
    verComentarios: true,
  };
  ModeloIdEliminar: string;
  btnExcelDescarga: boolean = false;
  roles = [];
  constructor(
    private rutaActiva: ActivatedRoute,
    private castingClient: CastingClient,
    private servicio: CastingReviewService,
    private personaClient: PersonaClient,
    private spinner: NgxSpinnerService,
    private ruta: Router,
    private session: SessionQuery,
    private fb: FormBuilder,
    private translate: TranslateService,
    private toastService: HotToastService,
    private excelDescargaServicio: DownloadExcelService
  ) {
    this.spinner.show('loadCategorias');
    this.rutaActiva.params.subscribe((params: Params) => {
      this.castingId = params['id'];
    });
    this.formAgregarModelo = this.fb.group({
      consecutivo: ['', Validators.required],
    });

    this.servicio.CastingSub().subscribe((c) => {
      this.casting = c;
      this.permisosCast = this.casting.pernisosEcternos;
      if (this.servicio.CategoriActual()) {
        this.onChangeCategoria(this.servicio.CategoriActual());
        this.hayCategorias = true;
      } else {
        this.categorias = c.categorias;
        if (this.categorias.length > 0) {
          this.hayCategorias = true;
        } else {
          this.hayCategorias = false;
        }
        this.spinner.hide('loadCategorias');
      }
    });
    this.servicio.ModelosSub().subscribe((m) => {
      this.personasDesplegables = m;
    });
    this.servicio.DiasSub().subscribe((d) => {
      var tmp: number[] = [];
      for (let index = 0; index < d; index++) {
        tmp.push(index + 1);
      }
      this.dias = tmp;
    });

    this.servicio.SpinnerSub().subscribe((m) => {
      if (m) {
        this.spinner.show('loadCategorias');
      } else {
        this.spinner.hide('loadCategorias');
      }
    });
  }

  ngOnInit(): void {
    this.servicio.PutModoTrabajo(true);
    this.servicio.obtieneCatalogoCliente().subscribe((done) => {
      this.roles = this.session.GetRoles;
      if (
        this.roles.indexOf(TipoRolCliente.RevisorExterno.toLocaleLowerCase()) >=
        0
      ) {
        this.puedeAgregarModelo = false;
      }
      if (this.roles.length == 0) {
        this.puedeAgregarModelo = false;
        this.EsAnonimo = true;
        this.permisosCast.verComentarios = false;
      }
      this.translate
        .get([
          'modelo.error-400',
          'modelo.modelo',
          'modelo.error-404',
          'modelo.error-409',
          'modelo.excel-status-suc',
          'modelo.excel-status-err',
          'modelo.error-500',
        ])
        .subscribe((ts) => {
          this.T = ts;
        });

      this.servicio.ActualizarCasting(this.castingId);
      this.servicio.CastingSub().subscribe((c) => {
        if (c != null && c.categorias.length > 0) {
          this.onChangeCategoria(c.categorias[0].id);
          this.CategoriaActual = c.categorias[0].id;
        }
      });
    });
  }
  onChangeCategoria(id: string) {
    this.CategoriaActual = id;
    this.diaActual = 0;
    this.spinner.show('loadCategorias');
    this.servicio.ActualizarCategoria(id);
    this.categoriaSeleccionada = true;
  }
  onChangeDia(dia: number) {
    this.diaActual = dia;
    this.spinner.show('loadCategorias');
    this.servicio.ActualizarDia(dia);
    this.categoriaSeleccionada = true;
  }
  volver() {
    this.ruta.navigateByUrl('/castings');
  }

  personaCargadaEvnt(r: boolean) {
    this.estadoPersona = r;
  }

  agregarModelo() {
    this.spinner.show('loadCategorias');
    this.castingClient
      .consecutivo(
        this.castingId,
        this.formAgregarModelo.get('consecutivo').value,
        this.servicio.CategoriActual()
      )
      .subscribe(
        (data) => {
          this.servicio.agregarModelo(data, this.servicio.CategoriActual());
          this.toastService.success(this.T['modelo.modelo'], {
            position: 'bottom-center',
          });
        },
        (err) => {
          this.spinner.hide('loadCategorias');
          if (parseInt(err.status) >= 400 && parseInt(err.status) < 500) {
            this.toastService.error(this.T[`modelo.error-${err.status}`], {
              position: 'bottom-center',
            });
          } else {
            this.toastService.error(this.T['modelo.error-400'], {
              position: 'bottom-center',
            });
          }
        }
      );
    this.formAgregarModelo.get('consecutivo').setValue(null);
  }
  removerModelo() {
    this.spinner.show('loadCategorias');
    this.castingClient
      .modeloDelete(
        this.castingId,
        this.ModeloIdEliminar,
        this.servicio.CategoriActual()
      )
      .subscribe((data) => {
        this.servicio.removerModelo(
          this.ModeloIdEliminar,
          this.servicio.CategoriActual()
        );
        this.diaActual = 0;
        this.categoriaSeleccionada = true;
        this.ModeloIdEliminar = null;
      });
  }

  //confirma  el remover un comentario
  confirmar(modeloId: string) {
    this.componenteModal.openModal(
      this.componenteModal.myTemplate,
      'remover el modelo'
    );
    this.ModeloIdEliminar = modeloId;
  }
  // Auxiliares UI
  recibidoDelModal(r: string) {
    if (r == 'Y') {
      this.removerModelo();
    }
    this.ModeloIdEliminar = null;
  }

  excelDescarga(castingId: string): void {
    this.spinner.show('loadCategorias');
    this.btnExcelDescarga = true;
    this.excelDescargaServicio.descargarArchivoExcel2(castingId).subscribe(
      (response: HttpResponse<Blob>) => {
        const blobData: Blob = response.body;
        this.descargarArchivo(blobData);
      },
      (err) => {
        this.spinner.hide('loadCategorias');
        this.btnExcelDescarga = false;
        this.toastService.error(this.T['modelo.excel-status-err'], {
          position: 'bottom-center',
        });
      }
    );
  }

  private descargarArchivo(blobData: Blob): void {
    const currentDate: Date = new Date();
    const formattedDate: string = `${currentDate.getUTCFullYear()}-${(
      currentDate.getUTCMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${currentDate
      .getUTCDate()
      .toString()
      .padStart(2, '0')}`;
    const filename: string = `${formattedDate}__${this.casting.nombre}.pdf`;
    const url = window.URL.createObjectURL(blobData);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    if (a.download != null || a.download != '') {
      a.download = filename;
      this.btnExcelDescarga = false;
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      this.spinner.hide('loadCategorias');
      this.toastService.success(this.T['modelo.excel-status-suc'], {
        position: 'bottom-center',
      });
    }
  }
}
