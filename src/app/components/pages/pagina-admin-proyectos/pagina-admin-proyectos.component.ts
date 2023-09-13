import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';

import { BuscarProyectoDTO } from 'src/app/modelos/locales/buscar-proyecto-dto';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {FormControl, FormGroup} from '@angular/forms';

import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';



import {
  CastingClient,
  CastingListElement,
  ClientesClient,
  Casting,
  EstadoCasting,
} from 'src/app/services/api/api-promodel';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  RowSelectedEvent,
  SortDirection,
  ValueFormatterParams,
} from 'ag-grid-community';

import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { identifierName } from '@angular/compiler';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-pagina-admin-proyectos',
  templateUrl: './pagina-admin-proyectos.component.html',
  styleUrls: ['./pagina-admin-proyectos.component.scss'],
})
export class PaginaAdminProyectosComponent implements OnInit {
  bsModalRef: BsModalRef;
  idSeleccionado: string = '';
  casting: CastingListElement[] = [];
  private gridApi!: GridApi<CastingListElement>;
  T: any;
  valoresdisponibles:number;
  v:string='x';

  constructor(
    private castingClient: CastingClient,
    @Inject(LOCALE_ID) private locale: string,
    private ruta: Router, private translate: TranslateService,
    private toastService: HotToastService
  ) {
  }


  ngOnInit(): void {
    this.castingClient.castingGet(true).subscribe((data) => {
      this.casting = data;
    });

    this.translate
    .get([
      'proyectos.casting-estado-ok',
      'proyectos.casting-estado-error'
    ]).subscribe((ts) => {
      this.T = ts;
    });


  }

  doQuery(query: BuscarProyectoDTO) {
    console.log(query);
  }

  creaProyecto() {
    this.ruta.navigateByUrl('castings/');
  }

  refrescar(){
    this.castingClient.castingGet(true).subscribe((data) => {
      this.casting = data;
    });
  }

  recibidoDelModal(r : string){
    if(r == 'Y'){
      this.castingClient.castingGet(true).subscribe((data) => {
        this.casting = data;
      });
    }
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
}
