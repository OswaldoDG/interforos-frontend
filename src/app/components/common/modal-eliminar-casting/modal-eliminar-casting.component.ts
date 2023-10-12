import { Component, OnInit, Output, TemplateRef, ViewChild, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-eliminar-casting',
  templateUrl: './modal-eliminar-casting.component.html',
  styleUrls: ['./modal-eliminar-casting.component.scss']
})
export class ModalEliminarCastingComponent implements OnInit {
  modalRef?: BsModalRef;
  confirmacionModalEliminar?: boolean = false;
  @ViewChild('contactoModal') myTemplate: TemplateRef<any>;
  @Output() modalConfirm : EventEmitter<string> = new EventEmitter();
  nombre : string;
  formModalCasting : FormGroup;
  constructor(private modalService: BsModalService,
    private formBuilder: FormBuilder,) {
      this.formModalCasting = this.formBuilder.group({
        nombre: ['', Validators.required]
      });
    }
  ngOnInit(): void {
  }


  openModal(template: TemplateRef<any>, nombreCasting : string){
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
    this.nombre = nombreCasting;
  }

  confirm(): void{
    if(this.formModalCasting.value.nombre == this.nombre){
      this.modalConfirm.emit('Y');
    }
    this.formModalCasting
    .get('nombre')
    .setValue('');
    this.modalRef?.hide();
  }

  decline():void{
    this.modalRef?.hide();
    this.formModalCasting
    .get('nombre')
    .setValue('');
  }

}
