import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Observable, Subscriber, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import {
  Casting,
  CastingClient,
  ContactoUsuario
} from 'src/app/services/api/api-promodel';
import { ContactosClienteComponent } from '../contactos-cliente/contactos-cliente.component';
import { Router } from '@angular/router';

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
  formProyecto: FormGroup;
  fechaAperturaSingle;
  fechaCierreSingle;
  modoSalvar: string;
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

  constructor(
    private localeService: BsLocaleService,
    private clientApi: CastingClient,
    private formBuilder: FormBuilder,
    private ruta: Router,
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
    if (this.CastingId != null) {
      this.modoSalvar = 'Editar';
      this.editar(this.CastingId, this.formProyecto);
    } else {
      this.modoSalvar = 'Insertar';
    }
  }

  saveToList() {
    if (this.modoSalvar == 'Insertar') {
      this.salvarDatos(this.formProyecto, this.modoSalvar);
    } else if (this.modoSalvar == 'Editar') {
      this.salvarDatos(this.formProyecto, this.modoSalvar);
    }
  }

  onChangedEditor(event: any): void {
    if (event.html) {
      this.formProyecto.get('descripcion').setValue(event.html);
    }
  }

  editar(id: string, formProyecto) {
    this.CastingActual = null;
    this.clientApi.$id(id).subscribe((data) => {
      this.CastingActual = data;
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
    this.clientApi.castingPut(IdCasting, datos).subscribe((data) => {
      this.CastingActual = data;
      if(this.CastingActual != null){
        this.componenteContactos.actualizaContactos(this.CastingActual.id);
        this.ruta.navigateByUrl('proyectos/casting/' + this.CastingActual.id);
      }
    });
  }

  altaCasting(datos: Casting) {
    this.clientApi.castingPost(datos).subscribe((data) => {
      this.CastingActual = data;
      if(this.CastingActual != null){
        this.componenteContactos.actualizaContactos(this.CastingActual.id);
      }
    });
  }
}
