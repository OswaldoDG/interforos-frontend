import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Casting, CastingClient } from 'src/app/services/api/api-promodel';
import { from } from 'rxjs';
import { PaginaAdminProyectosComponent } from '../../pages/pagina-admin-proyectos/pagina-admin-proyectos.component';

@Component({
  selector: 'app-modal-upsert-proyecto',
  templateUrl: './modal-upsert-proyecto.component.html',
  styleUrls: ['./modal-upsert-proyecto.component.scss'],
})
export class ModalUpsertProyectoComponent implements OnInit {
  public event: EventEmitter<any> = new EventEmitter();
  formProyecto: FormGroup;
  fechaAperturaSingle;
  fechaCierreSingle;
  id : string = '';
  httpCode :any;

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
  public htmlContent: any;

  constructor(
    private localeService: BsLocaleService,
    private formBuilder: FormBuilder,
    public bsModalRef: BsModalRef,
    private clientApi : CastingClient

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
    this.formProyecto.valueChanges.subscribe((c) => {
      console.log(c);
    });
    this.editar(this.id);
  }

  hideModal() {
    this.bsModalRef.hide();
  }

  saveToList(formProyecto) {
    const datos : Casting = {
      nombre : formProyecto.value.nombre,
      nombreCliente : formProyecto.value.nombreCliente,
      fechaApertura : formProyecto.value.fechaApertura,
      fechaCierre : formProyecto.value.fechaCierre,
      descripcion : formProyecto.value.descripcion
    }
    this.triggerEvent(datos);
    this.bsModalRef.hide();
  }

  onChangedEditor(event: any): void {
    if (event.html) {
      this.formProyecto.get('descripcion').setValue(event.html);
    }
  }

  triggerEvent(item: any) {
    console.log(JSON.stringify(item));
    this.event.emit(item);
  }

  editar(id:string){
    console.log('Buscando id');
    console.log(id);
    this.clientApi.$id(id).subscribe(
      (data) => {
        this.httpCode = data;
      }
    )

      console.log('imprimiendo data: ' + this.httpCode);
  }
}
