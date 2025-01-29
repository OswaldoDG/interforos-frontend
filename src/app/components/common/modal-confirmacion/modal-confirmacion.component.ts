import { Component, OnInit, Output, TemplateRef, ViewChild, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-confirmacion',
  templateUrl: './modal-confirmacion.component.html',
  styleUrls: ['./modal-confirmacion.component.scss']
})
export class ModalConfirmacionComponent implements OnInit {
  //modal
  modalRef?: BsModalRef;
  confirmacionModalEliminar?: boolean = false;
  @ViewChild('contactoModal') myTemplate: TemplateRef<any>;
  @Output() modalConfirm = new EventEmitter();
  tipo : string;
  constructor(private modalService: BsModalService) { }

  ngOnInit(): void {
  }


  openModal(template: TemplateRef<any>, tipo: string){
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
    this.tipo = tipo;
  }

  confirm(): void{
    this.modalConfirm.emit('Y');
    this.modalRef?.hide();
  }

  decline():void{
    this.modalRef?.hide();
  }

}
