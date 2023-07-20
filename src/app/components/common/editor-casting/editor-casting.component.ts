import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Observable, Subscriber, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import {
  Casting,
  CastingClient,
  ClientesClient,
  ContactoUsuario,
} from 'src/app/services/api/api-promodel';
import { ContactosClienteComponent } from '../contactos-cliente/contactos-cliente.component';

@Component({
  selector: 'app-editor-casting',
  templateUrl: './editor-casting.component.html',
  styleUrls: ['./editor-casting.component.scss'],
})
export class EditorCastingComponent implements OnInit {

  // Almacena los datos del casting actual
  CastingActual: Casting = null;
  @ViewChild('contactos') componenteContactos: ContactosClienteComponent;

  public event: EventEmitter<any> = new EventEmitter();
  contactosUsuario: ContactoUsuario[] = [];
  formProyecto: FormGroup;
  fechaAperturaSingle;
  fechaCierreSingle;
  Respuesta: Casting;
  modoSalvar: string;
  selected?: string;
  noResult = false;
  // Cuando se recibe un Casting ID se trata de un update
  // si es nulo es una adición
  @Input() CastingId: string = null;

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

  typeaheadNoResults(event: boolean): void {
    this.noResult = event;
  }
  constructor(
    private localeService: BsLocaleService,
    private clientApi: CastingClient,
    private clientesClient: ClientesClient,
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
    this.clientesClient.contactosCliente().subscribe((data) => {
      this.contactosUsuario = data;
    });
    if (this.CastingId != null) {
      console.log('Haremos la Actualización');
      this.modoSalvar = 'Editar';
      this.editar(this.CastingId, this.formProyecto);
    } else {
      console.log('Se hará una inserción');
      this.modoSalvar = 'Insertar';
    }
  }
  saveToList(formProyecto, modoSalvar) {
    if (modoSalvar == 'Insertar') {
      this.salvarDatos(formProyecto, modoSalvar);
    } else if (modoSalvar == 'Editar') {
      this.salvarDatos(formProyecto, modoSalvar);
    }
  }

  onChangedEditor(event: any): void {
    if (event.html) {
      this.formProyecto.get('descripcion').setValue(event.html);
    }
  }

  editar(id: string, formProyecto) {
    this.CastingActual = null;
    console.log('Buscando id');
    this.clientApi.$id(id).subscribe((data) => {
      this.CastingActual = data;
      console.log('Imipriendo datos de busqueda');
      console.log(this.CastingActual);
      if (this.CastingActual != null) {
        formProyecto.get('nombre').setValue(this.CastingActual.nombre);
        formProyecto
          .get('nombreCliente')
          .setValue(this.CastingActual.nombreCliente);
        formProyecto
          .get('fechaApertura')
          .setValue(this.CastingActual.fechaApertura);
        formProyecto
          .get('fechaCierre')
          .setValue(this.CastingActual.fechaCierre);
        formProyecto
          .get('descripcion')
          .setValue(this.CastingActual.descripcion);
      } else {
        console.log('no se pueden, llenar los datos');
      }
    });
  }

  salvarDatos(formProyecto, modo: string) {
    const datos: Casting = {
      nombre: formProyecto.value.nombre,
      nombreCliente: formProyecto.value.nombreCliente,
      fechaApertura: formProyecto.value.fechaApertura,
      fechaCierre: formProyecto.value.fechaCierre,
      descripcion: formProyecto.value.descripcion,
    };
    if (modo == 'Editar') {
      this.actualizarCasting(this.CastingId, datos);
    } else if (modo == 'Insertar') {
      this.altaCasting(datos);
    }
  }

  actualizarCasting(IdCasting: string, datos: Casting) {
    console.log('Intentanod hacer el put');
    console.log(datos);
    this.clientApi.castingPut(IdCasting, datos).subscribe((data) => {
      this.Respuesta = data;
      console.log(this.Respuesta);
    });
  }

  altaCasting(datos: Casting) {
    console.log('Intentanod hacer el POST');
    console.log(datos);
    this.clientApi.castingPost(datos).subscribe((data) => {
      this.Respuesta = data;
      console.log(this.Respuesta);
    });
  }
}
