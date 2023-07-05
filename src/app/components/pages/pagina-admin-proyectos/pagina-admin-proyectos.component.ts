import { Component, EventEmitter, OnInit } from '@angular/core';
import { BuscarProyectoDTO } from 'src/app/modelos/locales/buscar-proyecto-dto';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalUpsertProyectoComponent } from '../../common/modal-upsert-proyecto/modal-upsert-proyecto.component';
import { Casting, CastingClient } from 'src/app/services/api/api-promodel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagina-admin-proyectos',
  templateUrl: './pagina-admin-proyectos.component.html',
  styleUrls: ['./pagina-admin-proyectos.component.scss'],
})
export class PaginaAdminProyectosComponent implements OnInit {
  bsModalRef: BsModalRef;
  data : Casting;
  public event: EventEmitter<any> = new EventEmitter();
  constructor(private modalService: BsModalService, private ruta: Router) {}

  ngOnInit(): void {}

  doQuery(query: BuscarProyectoDTO) {
    console.log(query);
  }

  creaProyecto() {
    this.ruta.navigateByUrl('proyectos/casting');
  }
}
