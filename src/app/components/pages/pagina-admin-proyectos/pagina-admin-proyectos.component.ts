import { Component, EventEmitter, OnInit } from '@angular/core';
import { BuscarProyectoDTO } from 'src/app/modelos/locales/buscar-proyecto-dto';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalUpsertProyectoComponent } from '../../common/modal-upsert-proyecto/modal-upsert-proyecto.component';
import {
  CastingClient,
  CastingListElement,
} from 'src/app/services/api/api-promodel';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  RowSelectedEvent,
  SortDirection,
} from 'ag-grid-community';
import { localeEs } from './ad-gridES.js';
import { Casting, CastingClient } from 'src/app/services/api/api-promodel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagina-admin-proyectos',
  templateUrl: './pagina-admin-proyectos.component.html',
  styleUrls: ['./pagina-admin-proyectos.component.scss'],
})
export class PaginaAdminProyectosComponent implements OnInit {
  bsModalRef: BsModalRef;
  idSeleccionado = '';
  casting: CastingListElement[] = [];
  public gridOptions = {};
  private gridApi!: GridApi<CastingListElement>;

  columnDefs: ColDef[] = [
    {
      headerName: 'Nombre',
      field: 'nombre',
      width: 150,
      editable: false,
      sortable: true,
    },
    {
      headerName: 'Cliente',
      field: 'nombreCliente',
      width: 150,
      editable: false,
      sortable: true,
    },
    {
      headerName: 'Apertura',
      field: 'fechaApertura',
      editable: false,
      width: 150,
      sortable: true,
    },
    {
      headerName: 'Cierre',
      field: 'fechaCierre',
      editable: false,
      width: 150,
      sortable: true,
    },
    {
      headerName: 'Acepta AutoInscripcion',
      field: 'aceptaAutoInscripcion',
      cellRenderer: checkboxCellRenderer,
      width: 80,
      editable: false,
      sortable: true,
    },
    {
      headerName: 'Activo',
      field: 'activo',
      cellRenderer: checkboxCellRenderer,
      width: 80,
      editable: false,
      sortable: true,
    },
    {
      headerName: 'Apertura Automatica',
      field: 'aperturaAutomatica',
      cellRenderer: checkboxCellRenderer,
      width: 80,
      editable: false,
      sortable: true,
    },
    {
      headerName: 'Cierre Automatico',
      field: 'cierreAutomatico',
      cellRenderer: checkboxCellRenderer,
      width: 80,
      editable: false,
      sortable: true,
    },
  ];
  data : Casting;
  public event: EventEmitter<any> = new EventEmitter();
  constructor(private modalService: BsModalService, private ruta: Router) {}

  public defaultColDef: ColDef = {
    resizable: true,
    initialWidth: 200,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 100,
  };

  constructor(
    private modalService: BsModalService,
    private castingClient: CastingClient
  ) {}

  ngOnInit(): void {
    this.gridOptions = {
      localeTextFunc: (key: string, defaultValue: string) =>
        localeEs[key] || defaultValue,
    };
  }

  doQuery(query: BuscarProyectoDTO) {
    console.log(query);
  }

  creaProyecto() {
    this.ruta.navigateByUrl('proyectos/casting');
  }

  onRowSelected(event: RowSelectedEvent) {
    this.idSeleccionado = event.node.data.id;
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
      console.log(this.casting);
    });
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
}

function checkboxCellRenderer(params) {
  var input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = params.value;
  input.disabled = true;
  return input;
}
