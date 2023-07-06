import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { BuscarProyectoDTO } from 'src/app/modelos/locales/buscar-proyecto-dto';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalUpsertProyectoComponent } from '../../common/modal-upsert-proyecto/modal-upsert-proyecto.component';
import {
  CastingClient,
  CastingListElement,
  ClientesClient,
} from 'src/app/services/api/api-promodel';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  RowSelectedEvent,
  SortDirection,
} from 'ag-grid-community';
import { formatDate } from '@angular/common';
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
      cellRenderer: (data) => {
        return formatDate(data.value, 'MM-dd-YYYY', this.locale);
      },
    },
    {
      headerName: 'Cierre',
      field: 'fechaCierre',
      editable: false,
      width: 150,
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
      width: 80,
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
      width: 80,
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
      width: 80,
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
      width: 80,
      editable: false,
      sortable: true,
    },
  ];

  public defaultColDef: ColDef = {
    resizable: true,
    initialWidth: 200,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    sortable: true,
    filter: true,
    minWidth: 100,
  };

  constructor(
    private modalService: BsModalService,
    private castingClient: CastingClient,
    @Inject(LOCALE_ID) private locale: string
  ) {}

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

  columSelect() {
    const selectedRows = this.gridApi.getSelectedRows();
    this.idSeleccionado = selectedRows.length === 1 ? selectedRows[0].id : null;
    console.log(this.idSeleccionado);
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
