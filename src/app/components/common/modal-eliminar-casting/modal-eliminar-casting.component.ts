import {
  Component,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-eliminar-casting',
  templateUrl: './modal-eliminar-casting.component.html',
  styleUrls: ['./modal-eliminar-casting.component.scss'],
})
export class ModalEliminarCastingComponent implements OnInit {
  modalRef?: BsModalRef;
  confirmacionModalEliminar?: boolean = false;
  @ViewChild('contactoModal') myTemplate: TemplateRef<any>;
  @Output() modalConfirm: EventEmitter<string> = new EventEmitter();
  nombre: string;
  formModalCasting: FormGroup;
  ELIMINAR = 'DELETE';
  T: any;
  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private toastService: HotToastService
  ) {
    this.formModalCasting = this.formBuilder.group({
      nombre: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.translate.get(['proyectos.error-confirmacion']).subscribe((ts) => {
      this.T = ts;
    });
  }

  openModal(template: TemplateRef<any>, nombreCasting: string) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.nombre = nombreCasting;
  }

  confirm(): void {
    if (this.formModalCasting.value.nombre == this.ELIMINAR) {
      this.modalConfirm.emit('Y');
      this.formModalCasting.get('nombre').setValue('');
      this.modalRef?.hide();
    } else {
      this.formModalCasting.get('nombre').setValue('');
      this.toastService.error(this.T['proyectos.error-confirmacion'], {
        position: 'bottom-center',
      });
    }
  }

  decline(): void {
    this.modalRef?.hide();
    this.formModalCasting.get('nombre').setValue('');
  }
}
