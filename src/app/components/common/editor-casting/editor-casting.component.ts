import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Casting, CastingClient } from 'src/app/services/api/api-promodel';
import { ContactosClienteComponent } from '../contactos-cliente/contactos-cliente.component';
import { CategoriasCastingComponent } from '../categorias-casting/categorias-casting.component';

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

  constructor(
    private localeService: BsLocaleService,
    private clientApi: CastingClient,
    private formBuilder: FormBuilder
  ) {
    this.formProyecto = this.formBuilder.group({
      nombre: ['', Validators.required],
      nombreCliente: ['', Validators.required],
      fechaApertura: [null],
      fechaCierre: [null],
      descripcion: [null],
    });
    this.localeService.use('es');
  }

  ngOnInit() {
    this.esUpdate = this.CastingId != null;
    if (this.esUpdate) {
      this.obtenerCasting();
    }
  }

  onChangedEditor(event: any): void {
    if (event.html) {
      this.formProyecto.get('descripcion').setValue(event.html);
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
    const datos: Casting = {
      nombre: this.formProyecto.value.nombre,
      nombreCliente: this.formProyecto.value.nombreCliente,
      fechaApertura: this.formProyecto.value.fechaApertura,
      fechaCierre: this.formProyecto.value.fechaCierre,
      descripcion: this.formProyecto.value.descripcion,
    };

    this.clientApi.castingPost(datos).subscribe((data) => {
      console.log(data);
      this.CastingActual = data;
      this.CastingId = data.id;
      this.actualizarLogo(data.id);
      this.esUpdate = true;
      if (data != null) {
        this.componenteContactos.actualizaContactos(this.CastingId);
        this.componenteCategorias.enviarCategorias(this.CastingActual);
      }
    });
  }

  // Actualzia el casting con los datos de la forma
  actualizarCasting() {
    if (!this.CastingId) {
      return;
    }

    this.CastingActual.id = this.CastingId;
    (this.CastingActual.nombre = this.formProyecto.value.nombre),
      (this.CastingActual.nombreCliente =
        this.formProyecto.value.nombreCliente),
      (this.CastingActual.fechaApertura =
        this.formProyecto.value.fechaApertura),
      (this.CastingActual.fechaCierre = this.formProyecto.value.fechaCierre),
      (this.CastingActual.descripcion = this.formProyecto.value.descripcion),
      this.clientApi
        .castingPut(this.CastingId, this.CastingActual)
        .subscribe((data) => {
          if (
            this.componenteContactos.Casting != null &&
            this.componenteCategorias.Casting != null
          ) {
            this.componenteContactos.actualizaContactos(this.CastingId);
            this.componenteCategorias.enviarCategorias(this.CastingActual);
          }
        });
    this.actualizarLogo(this.CastingActual.id);
  }

  // Obitne el casting y asigna los valores del form
  obtenerCasting() {
    this.clientApi.id(this.CastingId).subscribe((data) => {
      console.log(data);
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

        //Obtine el logo Relacionado al casting
        this.clientApi.logoGet(this.CastingActual.id).subscribe((data) => {
          if (data != null) {
            this.logoCasting = data;
            this.isImageLoading = true;
          } else {
            this.isImageLoading = false;
          }
        });
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
