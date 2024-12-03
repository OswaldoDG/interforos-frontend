import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ListasClient, ListaTalento, TipoRolCliente } from 'src/app/services/api/api-promodel';
import { SessionQuery } from 'src/app/state/session.query';
import { ModalEliminaListaComponent } from '../modal-elimina-lista/modal-elimina-lista.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-list-card',
  templateUrl: './list-card.component.html',
  styleUrls: ['./list-card.component.scss']
})
export class ListCardComponent implements OnInit {
  @Input() listaTalento: ListaTalento;
  @Output() lista = new EventEmitter<ListaTalento>();
  @ViewChild(ModalEliminaListaComponent) listComponentModal;
  @Output() modalOk = new EventEmitter<boolean>();
  T: any;
  esStaff: boolean;
  esRevisor: boolean;
  esAdmin: boolean;
  urlImage: string;

  constructor(
    private servicio: SessionQuery,
    private spinner: NgxSpinnerService,
    private listasApi: ListasClient,
    private toastService: HotToastService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.validarRol();
    this.translate.get([
      'proyectos.succes-mensaje-elimina-lista',
      'error-mensaje-elimina-lista'
    ]).subscribe((ts) => {
      this.T = ts;
    });
  }

  editarCasting(listaTalento: ListaTalento): void {
    this.lista.emit(listaTalento);
  }

  confirmar(): void {
    this.listComponentModal.openModal(
      this.listComponentModal.myTemplate,
      this.listaTalento.nombre
    );
  }

  reciboDelModal(r: string): void {
    this.spinner.show('load');
    if (r == "Y") {
      this.listasApi.listasDelete(this.listaTalento.id).subscribe({
        next: res => {
          this.modalOk.emit(true);
          this.spinner.hide('load');
          this.toastService.success(
            this.T['proyectos.succes-mensaje-elimina-lista'],
            {
              position: 'bottom-center'
            }
          );

        },
        error: e => {
          this.spinner.hide('load');
          this.toastService.error(
            this.T['error-mensaje-elimina-lista'],
            { position: 'bottom-center' }
          );
        }
      })
    }
  }

  validarRol() {
    const rol: string = this.servicio.GetRoles;
    if (
      rol == TipoRolCliente.Staff.toLocaleLowerCase() ||
      rol == TipoRolCliente.Administrador.toLocaleLowerCase()
    ) {
      this.esStaff = true;
      this.esAdmin = true;
      this.esRevisor = false;
    } else {
      this.esRevisor = true;
      this.esStaff = false;
      this.esAdmin = false;
    }
  }

}
