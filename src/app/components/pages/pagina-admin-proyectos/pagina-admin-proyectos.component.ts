import { Component, OnInit } from '@angular/core';
import { BuscarProyectoDTO } from 'src/app/modelos/locales/buscar-proyecto-dto';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalUpsertProyectoComponent } from '../../common/modal-upsert-proyecto/modal-upsert-proyecto.component';

@Component({
  selector: 'app-pagina-admin-proyectos',
  templateUrl: './pagina-admin-proyectos.component.html',
  styleUrls: ['./pagina-admin-proyectos.component.scss'],
})
export class PaginaAdminProyectosComponent implements OnInit {
  bsModalRef: BsModalRef;

  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {}

  doQuery(query: BuscarProyectoDTO) {
    console.log(query);
  }

  creaProyecto() {
    this.openModalWithComponent();
  }

  openModalWithComponent() {
    const initialState = {};
    this.bsModalRef = this.modalService.show(ModalUpsertProyectoComponent, {
      initialState,
    });
    this.bsModalRef.content.closeBtnName = 'Close';

    this.bsModalRef.content.event.subscribe((res) => {
      console.log(res);
    });
  }
}
