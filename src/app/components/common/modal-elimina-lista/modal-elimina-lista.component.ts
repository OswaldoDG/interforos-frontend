import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-modal-elimina-lista',
  templateUrl: './modal-elimina-lista.component.html',
  styleUrls: ['./modal-elimina-lista.component.scss']
})
export class ModalEliminaListaComponent implements OnInit {

  @ViewChild('contactoModalListas') myTemplate: TemplateRef<any>;
  @Output() modalConfirm: EventEmitter<string> = new EventEmitter();

  modalRef?: BsModalRef;
  confirmacionModalEliminarLista?: boolean = false;
  formModalListas: FormGroup;
  ELIMINAR: string = "DELETE";
  T: any
  nombre: string;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private toastService: HotToastService
  ) {
    this.formModalListas = formBuilder.group({
      nombre: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.translate.get(['proyectos.error-confirmacion']).subscribe((ts) => {
      this.T = ts;
    })
  }

  openModal(template: TemplateRef<any>, nombreCasting: string) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.nombre = nombreCasting;
  }

  confirm(): void {
    if (this.formModalListas.value.nombre == this.ELIMINAR) {
      this.modalConfirm.emit('Y');
      this.formModalListas.get('nombre').setValue('');
      this.modalRef?.hide();
    } else {
      this.formModalListas.get('nombre').setValue('');
      this.toastService.error(this.T['proyectos.error-confirmacion'], {
        position: 'bottom-center',
      });
    }
  }

  decline(): void {
    this.modalRef?.hide();
    this.formModalListas.get('nombre').setValue('');
  }

}
