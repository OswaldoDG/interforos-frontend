import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal';

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
    public bsModalRef: BsModalRef
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
  }

  hideModal() {
    this.bsModalRef.hide();
  }

  saveToList(form) {
    this.triggerEvent(form.value.name);
    this.bsModalRef.hide();
  }

  onChangedEditor(event: any): void {
    if (event.html) {
      this.formProyecto.get('descripcion').setValue(event.html);
    }
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }
}
