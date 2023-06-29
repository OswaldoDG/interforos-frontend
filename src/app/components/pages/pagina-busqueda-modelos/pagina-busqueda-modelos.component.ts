import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { PersonaResponsePaginado } from 'src/app/services/api/api-promodel';
import { PersonaInfoService } from 'src/app/services/persona/persona-info.service';

@Component({
  selector: 'app-pagina-busqueda-modelos',
  templateUrl: './pagina-busqueda-modelos.component.html',
  styleUrls: ['./pagina-busqueda-modelos.component.scss'],
  providers: [PersonaInfoService],
})
export class PaginaBusquedaModelosComponent implements OnInit {
  PaginadoPersonas: PersonaResponsePaginado = undefined;

  constructor(private spinner: NgxSpinnerService) {}

  ngOnInit(): void {}

  PersonasEncontradas(p) {
    this.PaginadoPersonas = p;
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
