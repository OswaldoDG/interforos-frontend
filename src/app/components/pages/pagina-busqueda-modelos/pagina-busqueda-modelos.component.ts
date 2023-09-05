import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  BusquedaPersonasRequestPaginado,
  PersonaResponsePaginado,
} from 'src/app/services/api/api-promodel';
import { CastingStaffServiceService } from 'src/app/services/casting-staff-service.service';
import { PersonaInfoService } from 'src/app/services/persona/persona-info.service';

@Component({
  selector: 'app-pagina-busqueda-modelos',
  templateUrl: './pagina-busqueda-modelos.component.html',
  styleUrls: ['./pagina-busqueda-modelos.component.scss'],
  providers: [PersonaInfoService],
})
export class PaginaBusquedaModelosComponent implements OnInit {
  personasBuscar: BusquedaPersonasRequestPaginado = undefined;

  constructor(
    private spinner: NgxSpinnerService,
    private servicio: CastingStaffServiceService
  ) {}

  ngOnInit(): void {
    this.servicio.PutModoTrabajo(true);
  }

  PersonasBuscar(p) {
    this.PersonasBuscar = p;
  }

  EstadoBusqueda(buscando: boolean) {
    if (buscando) {
      this.spinner.show('buscar');
    } else {
      this.spinner.hide('buscar');
    }
  }

  pageTitleContent = [
    {
      title: 'modelo.t-modelo',
      backgroundImage: 'assets/img/page-title/title-gen-bg.jpg',
    },
  ];
}
