import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  Casting,
  CastingClient,
  ContactoUsuario
} from 'src/app/services/api/api-promodel';
import { ContactosClienteComponent } from '../contactos-cliente/contactos-cliente.component';
import { EventosCastingComponent } from '../eventos-casting/eventos-casting.component';
import { DateTimeAdapter } from 'ng-pick-datetime';

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
  @ViewChild('eventos') componenteEventos: EventosCastingComponent;
  // Mantiene los datos del casting en el formulario
  formProyecto: FormGroup;

  // determina si se trata de una adición o actualización
  esUpdate: boolean = false;
  fechaAperturaSingle: any;
  fechaCierreSingle: any;

  constructor(
    private clientApi: CastingClient,
    private formBuilder: FormBuilder,
    private dateTimeAdapter: DateTimeAdapter<any>,
  ) {
    this.formProyecto = this.formBuilder.group({
      nombre: ['', Validators.required],
      nombreCliente: ['', Validators.required],
      fechaApertura: [null],
      fechaCierre: [null],
      descripcion: [null],
    });
    this.dateTimeAdapter.setLocale('es-ES');
  }

  ngOnInit() {
    this.esUpdate = this.CastingId != null;

    if (this.esUpdate) {
      console.log('Es un update');
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
    }
    else
    {
      this.altaCasting();
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
      this.CastingActual = data;
      this.CastingId = data.id;
      this.esUpdate = true;
      if(data != null){
/*          this.componenteContactos.actualizaContactos(this.CastingId);
 */         this.componenteEventos.actualizarEventos(this.CastingActual);

      }
    });
    this.obtenerCasting();
  }


  // Actualzia el casting con los datos de la forma
  actualizarCasting() {

    if(!this.CastingId) {
      return;
    }

    this.CastingActual.id = this.CastingId;
    this.CastingActual.nombre = this.formProyecto.value.nombre,
    this.CastingActual.nombreCliente = this.formProyecto.value.nombreCliente,
    this.CastingActual.fechaApertura = this.formProyecto.value.fechaApertura,
    this.CastingActual.fechaCierre = this.formProyecto.value.fechaCierre,
    this.CastingActual.descripcion = this.formProyecto.value.descripcion,

    this.clientApi.castingPut(this.CastingId, this.CastingActual).subscribe((data) => {
      if(this.componenteEventos.Casting != null){
/*          this.componenteContactos.actualizaContactos(this.CastingId);
 */        this.componenteEventos.actualizarEventos(this.CastingActual);
      }
    });
  }


  // Obitne el casting y asigna los valores del form
  obtenerCasting() {
    console.log('Se llena la tabla');
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

}
