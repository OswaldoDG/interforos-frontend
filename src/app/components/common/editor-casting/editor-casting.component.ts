import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriasCastingComponent } from '../categorias-casting/categorias-casting.component';
import {
  Casting,
  CastingClient,
  ContactoCasting,
  ContactoUsuario,
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
  private T: any;
  constructor(
    private clientApi: CastingClient,
    private formBuilder: FormBuilder,
    private dateTimeAdapter: DateTimeAdapter<any>,
    private translate: TranslateService,
    private toastService: HotToastService,
    private spinner: NgxSpinnerService,
  ) {
    this.formProyecto = this.formBuilder.group({
      nombre: ['', Validators.required],
      nombreCliente: ['', Validators.required],
      fechaApertura: [null],
      fechaCierre: [null],
      descripcion: [null],
      aceptaAutoInscripcionModelos: [this.inscripcionAutomatica],
      cierreAutomatico: [this.cierreAuto],
      aperturaAutomatica: [this.aperturaAuto],
    });
    this.dateTimeAdapter.setLocale('es-ES');
    this.translate.get(['casting.guardar']).subscribe((ts) => {
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
    this.toastService.success(this.T['casting.guardar'], {
      position: 'bottom-center',
    });
  }

  // Crea un casting y establece la variable para realizar actualización si la savaguarda es exitosa
  altaCasting() {
    const datos: Casting = {
      nombre: this.formProyecto.value.nombre,
      nombreCliente: this.formProyecto.value.nombreCliente,
      fechaApertura: this.formProyecto.value.fechaApertura,
      fechaCierre: this.formProyecto.value.fechaCierre,
      descripcion: this.formProyecto.value.descripcion,
      aceptaAutoInscripcion:
        this.formProyecto.value.aceptaAutoInscripcionModelos,
      cierreAutomatico: this.formProyecto.value.cierreAutomatico,
      aperturaAutomatica: this.formProyecto.value.aperturaAutomatica,
    };

    this.clientApi.castingPost(datos).subscribe((data1) => {
      this.CastingActual = data1;
      this.CastingId = data1.id;
      this.actualizarLogo(data1.id);
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
          this.clientApi.categoriasPut(this.CastingId, b).subscribe((data2) => {
            this.CastingActual = data1;
            this.CastingId = data1.id;
            this.componenteCategorias.gridApi.setRowData(b);
            this.componenteCategorias.categoriasCasting = [...b];
            this.clientApi.contactos(this.CastingId, c).subscribe((data3) => {
              this.componenteContactos.contactosCasting = [...data3];
              this.componenteContactos.gridApi.setRowData(
                this.componenteContactos.contactosCasting
              );
              this.CastingActual = data1;
              this.CastingId = data1.id;
            });
          });
        });
      }
    });
  }

  // Actualzia el casting con los datos de la forma
  actualizarCasting() {
    if (!this.CastingId) {
      return;
    }
    (this.CastingActual.nombre = this.formProyecto.value.nombre),
      (this.CastingActual.nombreCliente =
        this.formProyecto.value.nombreCliente),
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
                  });
              });
          });
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
      this.clientApi.logoPut(castignId, this.logoCasting).subscribe();
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
}
