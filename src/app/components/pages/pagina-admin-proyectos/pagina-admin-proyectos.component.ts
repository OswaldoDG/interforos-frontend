import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';

import { BuscarProyectoDTO } from 'src/app/modelos/locales/buscar-proyecto-dto';
import { BsModalRef } from 'ngx-bootstrap/modal';

import {
  CastingClient,
  CastingListElement,
  ClientesClient,
  Casting,
} from 'src/app/services/api/api-promodel';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  RowSelectedEvent,
  SortDirection,
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

  columnDefs: ColDef[] = [
    {
      headerName: 'Nombre',
      field: 'nombre',
      width: 180,
      editable: false,
      sortable: true,
    },
    {
      headerName: 'Cliente',
      field: 'nombreCliente',
      width: 180,
      editable: false,
      sortable: true,
    },
    {
      headerName: 'Apertura',
      field: 'fechaApertura',
      editable: false,
      width: 170,
      sortable: true,
      cellRenderer: (data) => {
        return formatDate(data.value, 'MM-dd-YYYY', this.locale);
      },
    },
    {
      headerName: 'Cierre',
      field: 'fechaCierre',
      editable: false,
      width: 170,
      sortable: true,
      cellRenderer: (data) => {
        return formatDate(data.value, 'dd-MM-YYYY', this.locale);
      },
    },
    {
      headerName: 'Acepta AutoInscripcion',
      field: 'aceptaAutoInscripcion',
      cellRenderer: 'agCheckboxCellRenderer',
      cellRendererParams: {
        disabled: true,
      },
      width: 100,
      editable: false,
      sortable: true,
    },
    {
      headerName: 'Activo',
      field: 'activo',
      cellRenderer: 'agCheckboxCellRenderer',
      cellRendererParams: {
        disabled: true,
      },
      width: 100,
      editable: false,
      sortable: true,
    },
    {
      headerName: 'Apertura Automatica',
      field: 'aperturaAutomatica',
      cellRenderer: 'agCheckboxCellRenderer',
      cellRendererParams: {
        disabled: true,
      },
      width: 100,
      editable: false,
      sortable: true,
    },
    {
      headerName: 'Cierre Automatico',
      field: 'cierreAutomatico',
      cellRenderer: 'agCheckboxCellRenderer',
      cellRendererParams: {
        disabled: true,
      },
      width: 100,
      editable: false,
      sortable: true,
    },
  ];
  data: Casting;
  public defaultColDef: ColDef = {
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    sortable: true,
    filter: true,
  };

  constructor(
    private castingClient: CastingClient,
    @Inject(LOCALE_ID) private locale: string,
    private ruta: Router
  ) {}

  ngOnInit(): void {}

  doQuery(query: BuscarProyectoDTO) {
    console.log(query);
  }

  creaProyecto() {
    this.ruta.navigateByUrl('castings/');
  }

  columSelected() {
    const selectedData = this.gridApi.getSelectedRows();
    this.idSeleccionado = selectedData[0].id;
    this.ruta.navigateByUrl('castings/' + this.idSeleccionado);
  }

  public resetear() {
    this.idSeleccionado = null;
  }

  public rowSelection: 'single' | 'multiple' = 'single';
  public paginationPageSize = 20;
  public sortingOrder: SortDirection[] = ['desc', 'asc', null];

  onGridReady(params: GridReadyEvent<CastingListElement>) {
    this.gridApi = params.api;
    this.castingClient.castingGet(true).subscribe((data) => {
      this.casting = data;
    });
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  editarDobleClick() {
    const selectedData = this.gridApi.getSelectedRows();
    this.idSeleccionado = selectedData[0].id;
    this.ruta.navigateByUrl('castings/' + this.idSeleccionado);
  }

  refrescar() {
    this.castingClient.castingGet(true).subscribe((data) => {
      this.gridApi.setRowData(data);
      this.gridApi.refreshCells();
    });
  }
}
