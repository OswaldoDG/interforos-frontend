import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriasCastingComponent } from '../categorias-casting/categorias-casting.component';
import {
  Casting,
  CastingClient,
  ContactoCasting,
  ContactoUsuario,
  PermisosCasting,
} from 'src/app/services/api/api-promodel';
import { ContactosClienteComponent } from '../contactos-cliente/contactos-cliente.component';
import { EventosCastingComponent } from '../eventos-casting/eventos-casting.component';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { isEmpty } from '@datorama/akita';
import { OnChange } from 'ngx-bootstrap/utils';
import { TranslateService } from '@ngx-translate/core';
import { HotToastService } from '@ngneat/hot-toast';
import { SessionQuery } from 'src/app/state/session.query';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editor-casting',
  templateUrl: './editor-casting.component.html',
  styleUrls: ['./editor-casting.component.scss'],
})
export class EditorCastingComponent implements OnInit {
  // Cuando se recibe un Casting ID se trata de un update
  // si es nulo es una adición
  @Input() CastingId: string = null;

  // Almacena los datos del casting actual
  CastingActual: Casting = null;
  @ViewChild('contactos') componenteContactos: ContactosClienteComponent;

  @ViewChild('categorias') componenteCategorias: CategoriasCastingComponent;

  @ViewChild('eventos') componenteEventos: EventosCastingComponent;
  // Mantiene los datos del casting en el formulario
  formProyecto: FormGroup;

  // determina si se trata de una adición o actualización
  esUpdate: boolean = false;
  fechaAperturaSingle: any;
  fechaCierreSingle: any;

  // VariablesLogo
  logoCasting: string;
  esLogoNuevo: boolean;
  nameImg: string;
  isImageLoading: boolean = false;
  logoDefault = './../../assets/img/casting/camera-icon.png';
  inscripcionAutomatica: boolean = false;
  cierreAuto: boolean = false;
  aperturaAuto: boolean = false;
  logoGuardado: boolean = false;
  //permisos
  verredesSociales: boolean = false;
  vertelefono: boolean = false;
  veremail: boolean = false;
  verhabilidades: boolean = false;
  verdatosGenerales: boolean = false;
  vergaleriaPersonal: boolean = true;
  verComentarios: boolean = false;
  verdireccion: boolean = false;
  private T: any;
  constructor(
    private clientApi: CastingClient,
    private formBuilder: FormBuilder,
    private dateTimeAdapter: DateTimeAdapter<any>,
    private translate: TranslateService,
    private toastService: HotToastService,
    private spinner: NgxSpinnerService
  ) {
    this.formProyecto = this.formBuilder.group({
      nombre: ['', Validators.required],
      nombreCliente: ['', Validators.required],
      casaProductora: ['', Validators.required],
      fechaApertura: [null],
      fechaCierre: [null],
      descripcion: [null],
      aceptaAutoInscripcionModelos: [this.inscripcionAutomatica],
      cierreAutomatico: [this.cierreAuto],
      aperturaAutomatica: [this.aperturaAuto],
      verRedesSociales: [this.verredesSociales],
      verTelefono: [this.vertelefono],
      verDireccion: [this.verdireccion],
      verEmail: [this.veremail],
      verHabilidades: [this.verhabilidades],
      verDatosGenerales: [this.verdatosGenerales],
      verGaleriaPersonal: [this.vergaleriaPersonal],
      verComentarios: [this.verComentarios],
    });
    this.dateTimeAdapter.setLocale('es-ES');
    this.translate
      .get([
        'casting.guardar',
        'casting.crear',
        'casting.error',
        'casting.categoria-guardar',
        'casting.categoria-eliminar',
        'casting.categoria-eliminar-error',
        'casting.categoria-guardar-error',
        'proyectos.form-compartir-notificacion',
        'proyectos.form-compartir-notificacion-error',
      ])
      .subscribe((ts) => {
        this.T = ts;
      });
  }

  ngOnInit() {
    if (
      this.CastingId.length == 0 ||
      this.CastingId == null ||
      this.CastingId == undefined
    ) {
      this.esUpdate = false;
    } else {
      this.esUpdate = true;
      this.obtenerCasting();
    }
  }

  salvarDatos() {
    if (this.esUpdate) {
      this.actualizarCasting();
    } else {
      if (this.logoCasting != undefined) {
        this.altaCasting();
      } else {
        this.esLogoNuevo = false;
      }
    }
  }

  // Crea un casting y establece la variable para realizar actualización si la savaguarda es exitosa
  altaCasting() {
    this.spinner.show('loadCasting');
    const permisos: PermisosCasting = {
      verRedesSociales: this.formProyecto.value.verRedesSociales,
      verTelefono: this.formProyecto.value.verTelefono,
      verDireccion: this.formProyecto.value.verDireccion,
      verEmail: this.formProyecto.value.verEmail,
      verHabilidades: this.formProyecto.value.verHabilidades,
      verDatosGenerales: this.formProyecto.value.verDatosGenerales,
      verGaleriaPersonal: this.formProyecto.value.verGaleriaPersonal,
      verComentarios: this.formProyecto.value.verComentarios,
    };
    const datos: Casting = {
      nombre: this.formProyecto.value.nombre,
      nombreCliente: this.formProyecto.value.nombreCliente,
      casaProductora: this.formProyecto.value.casaProductora,
      fechaApertura: this.formProyecto.value.fechaApertura,
      fechaCierre: this.formProyecto.value.fechaCierre,
      descripcion: this.formProyecto.value.descripcion,
      aceptaAutoInscripcion:
        this.formProyecto.value.aceptaAutoInscripcionModelos,
      cierreAutomatico: this.formProyecto.value.cierreAutomatico,
      aperturaAutomatica: this.formProyecto.value.aperturaAutomatica,
      pernisosEcternos: permisos,
    };

    this.clientApi.castingPost(datos).subscribe(
      (data1) => {
        this.CastingActual = data1;
        this.CastingId = data1.id;
        this.esUpdate = true;
        if (data1 != null) {
          var a = this.componenteEventos.listaEventos;
          var b = this.componenteCategorias.categoriasCasting;
          var c = this.componenteContactos.listaContactoUsuario();
          this.clientApi.eventos(this.CastingId, a).subscribe((data2) => {
            this.CastingActual = data1;
            this.CastingId = data1.id;
            this.componenteEventos.gridApi.setRowData(a);
            this.componenteEventos.listaEventos = [...a];
            this.clientApi
              .categoriasPut(this.CastingId, b)
              .subscribe((data2) => {
                this.CastingActual = data1;
                this.CastingId = data1.id;
                this.componenteCategorias.gridApi.setRowData(b);
                this.componenteCategorias.categoriasCasting = [...b];
                this.clientApi
                  .contactos(this.CastingId, c)
                  .subscribe((data3) => {
                    this.componenteContactos.contactosCasting = [...data3];
                    this.componenteContactos.gridApi.setRowData(
                      this.componenteContactos.contactosCasting
                    );
                    this.CastingActual = data1;
                    this.CastingId = data1.id;
                    this.actualizarLogo(data1.id);
                  });
              });
          });
        }
        this.spinner.hide('loadCasting');
        this.toastService.success(this.T['casting.crear'], {
          position: 'bottom-center',
        });
      },
      (error) => {
        this.spinner.hide('loadCasting');
        this.toastService.error(this.T['casting.error'], {
          position: 'bottom-center',
        });
      }
    );
  }

  // Actualzia el casting con los datos de la forma
  actualizarCasting() {
    this.spinner.show('loadCasting');
    if (!this.CastingId) {
      this.spinner.hide('loadCasting');
      return;
    }
    (this.CastingActual.nombre = this.formProyecto.value.nombre),
      (this.CastingActual.nombreCliente =
        this.formProyecto.value.nombreCliente),
      (this.CastingActual.casaProductora =
        this.formProyecto.value.casaProductora),
      (this.CastingActual.fechaApertura =
        this.formProyecto.value.fechaApertura),
      (this.CastingActual.fechaCierre = this.formProyecto.value.fechaCierre),
      (this.CastingActual.descripcion = this.formProyecto.value.descripcion),
      (this.CastingActual.aceptaAutoInscripcion =
        this.formProyecto.value.aceptaAutoInscripcionModelos),
      (this.CastingActual.cierreAutomatico =
        this.formProyecto.value.cierreAutomatico),
      (this.CastingActual.aperturaAutomatica =
        this.formProyecto.value.aperturaAutomatica),
      (this.CastingActual.pernisosEcternos.verRedesSociales =
        this.formProyecto.value.verRedesSociales),
      (this.CastingActual.pernisosEcternos.verTelefono =
        this.formProyecto.value.verTelefono),
      (this.CastingActual.pernisosEcternos.verEmail =
        this.formProyecto.value.verEmail),
      (this.CastingActual.pernisosEcternos.verHabilidades =
        this.formProyecto.value.verHabilidades),
      (this.CastingActual.pernisosEcternos.verDatosGenerales =
        this.formProyecto.value.verDatosGenerales),
      (this.CastingActual.pernisosEcternos.verGaleriaPersonal =
        this.formProyecto.value.verGaleriaPersonal),
      (this.CastingActual.pernisosEcternos.verComentarios =
        this.formProyecto.value.verComentarios),
      (this.CastingActual.pernisosEcternos.verDireccion =
        this.formProyecto.value.verDireccion),
      this.clientApi
        .castingPut(this.CastingId, this.CastingActual)
        .subscribe((data) => {
          if (
            this.componenteContactos.Casting != null &&
            this.componenteCategorias.Casting != null &&
            this.componenteEventos.Casting != null
          ) {
            var a = this.componenteEventos.listaEventos;
            var b = this.componenteCategorias.categoriasCasting;
            var c = this.componenteContactos.listaContactoUsuario();

            this.clientApi.eventos(this.CastingId, a).subscribe((data2) => {
              this.componenteEventos.gridApi.setRowData(a);
              this.componenteEventos.listaEventos = [...a];
              this.clientApi
                .categoriasPut(this.CastingId, b)
                .subscribe((data2) => {
                  this.componenteCategorias.gridApi.setRowData(b);
                  this.componenteCategorias.categoriasCasting = [...b];
                  this.clientApi
                    .contactos(this.CastingId, c)
                    .subscribe((data3) => {
                      this.componenteContactos.contactosCasting = [...data3];
                      this.componenteContactos.gridApi.setRowData(
                        this.componenteContactos.contactosCasting
                      );
                      this.actualizarLogo(this.CastingActual.id);
                      this.toastService.success(this.T['casting.guardar'], {
                        position: 'bottom-center',
                      });
                    });
                });
            });
            this.spinner.hide('loadCasting');
          }
        });
  }

  // Obitne el casting y asigna los valores del form
  obtenerCasting() {
    this.spinner.show('loadCasting');
    this.clientApi.id(this.CastingId).subscribe((data) => {
      this.CastingActual = data;
      if (this.CastingActual != null) {
        this.formProyecto.get('nombre').setValue(this.CastingActual.nombre);
        this.formProyecto
          .get('nombreCliente')
          .setValue(this.CastingActual.nombreCliente);
        this.formProyecto
          .get('casaProductora')
          .setValue(this.CastingActual.casaProductora);
        this.formProyecto
          .get('fechaApertura')
          .setValue(this.CastingActual.fechaApertura);
        this.formProyecto
          .get('fechaCierre')
          .setValue(this.CastingActual.fechaCierre);
        this.formProyecto
          .get('descripcion')
          .setValue(this.CastingActual.descripcion);
        this.formProyecto
          .get('aceptaAutoInscripcionModelos')
          .setValue(this.CastingActual.aceptaAutoInscripcion);
        this.formProyecto
          .get('cierreAutomatico')
          .setValue(this.CastingActual.cierreAutomatico);
        this.formProyecto
          .get('aperturaAutomatica')
          .setValue(this.CastingActual.aperturaAutomatica);
        this.formProyecto
          .get('verRedesSociales')
          .setValue(this.CastingActual.pernisosEcternos.verRedesSociales);
        this.formProyecto
          .get('verTelefono')
          .setValue(this.CastingActual.pernisosEcternos.verTelefono);
        this.formProyecto
          .get('verEmail')
          .setValue(this.CastingActual.pernisosEcternos.verEmail);
        this.formProyecto
          .get('verHabilidades')
          .setValue(this.CastingActual.pernisosEcternos.verHabilidades);
        this.formProyecto
          .get('verDatosGenerales')
          .setValue(this.CastingActual.pernisosEcternos.verDatosGenerales);
        this.formProyecto
          .get('verGaleriaPersonal')
          .setValue(this.CastingActual.pernisosEcternos.verGaleriaPersonal);
        this.formProyecto
          .get('verComentarios')
          .setValue(this.CastingActual.pernisosEcternos.verComentarios);
        this.formProyecto
          .get('verDireccion')
          .setValue(this.CastingActual.pernisosEcternos.verDireccion);
        //Obtine el logo Relacionado al casting
        this.clientApi.logoGet(this.CastingActual.id).subscribe((data) => {
          if (data != null) {
            this.logoCasting = data;
            this.isImageLoading = true;
          } else {
            this.isImageLoading = false;
          }
        });
        this.spinner.hide('loadCasting');
      }
    });
  }

  // funciones de soporte
  public modulesQuill = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ align: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean'],
    ],
  };
  //agregar o actuliza el log del casting
  actualizarLogo(castignId?: string) {
    if (this.esLogoNuevo && castignId != null) {
      this.clientApi.logoPut(castignId, this.logoCasting).subscribe(
        (data) => {
          this.logoGuardado = true;
        },
        (error) => {
          this.logoGuardado = false;
        }
      );
    }
    this.esLogoNuevo = false;
  }

  onChangeInscripcionAutomatica() {
    this.inscripcionAutomatica = !this.inscripcionAutomatica;
  }
  onChangeCierreAutomatico() {
    this.cierreAuto = !this.cierreAuto;
  }
  onChangeAperturaAutomatica() {
    this.aperturaAuto = !this.aperturaAuto;
  }
  onChangeVerRedesSociales() {
    this.verredesSociales = !this.verredesSociales;
  }
  onChangeVerTelefono() {
    this.vertelefono = !this.vertelefono;
  }
  onChangeVerEmail() {
    this.veremail = !this.veremail;
  }
  onChangeVerHabilidades() {
    this.verhabilidades = !this.verhabilidades;
  }
  onChangeVerDatosGenerales() {
    this.verdatosGenerales = !this.verdatosGenerales;
  }
  onChangeVerGaleriaPersonal() {
    this.vergaleriaPersonal = !this.vergaleriaPersonal;
  }
  onChangeVerComentarios() {
    this.verComentarios = !this.verComentarios;
  }
  onChangeVerDireccion() {
    this.verdireccion = !this.verdireccion;
  }

  //evento de input para cargar la imagen
  handleUpload(event) {
    const file = event.target.files[0];
    this.nameImg = event.target.files[0].name;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.logoCasting = reader.result.toString();
      this.esLogoNuevo = true;
      this.isImageLoading = true;
    };
  }

  recibidoGuardar(guardar: boolean) {
    if (this.esUpdate) {
      var b = this.componenteCategorias.categoriasCasting;
      this.clientApi.categoriasPut(this.CastingId, b).subscribe(
        (data2) => {
          this.componenteCategorias.gridApi.setRowData(b);
          this.componenteCategorias.categoriasCasting = [...b];
          if (guardar) {
            this.toastService.success(this.T['casting.categoria-guardar'], {
              position: 'bottom-center',
            });
          } else {
            this.toastService.success(this.T['casting.categoria-eliminar'], {
              position: 'bottom-center',
            });
          }
        },
        (err) => {
          if (guardar) {
            this.toastService.error(this.T['casting.categoria-guardar-error'], {
              position: 'bottom-center',
            });
          } else {
            this.toastService.error(
              this.T['casting.categoria-eliminar-error'],
              {
                position: 'bottom-center',
              }
            );
          }
        }
      );
    } else {
      if (guardar) {
        this.toastService.success(this.T['casting.categoria-guardar'], {
          position: 'bottom-center',
        });
      } else {
        this.toastService.success(this.T['casting.categoria-eliminar'], {
          position: 'bottom-center',
        });
      }
    }
  }
  getLink() {
    var rutaFinal = `${window.location.origin}/casting/${this.CastingId}`;
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
