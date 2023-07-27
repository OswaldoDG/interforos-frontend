import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { v4 as uuid } from 'uuid';
import {
  Casting,
  CastingClient,
  CategoriaCasting,
} from 'src/app/services/api/api-promodel';
import { BtnCloseRenderer } from '../cells-render/btn-close-renderer.component';
import { BtnEditRenderer } from '../cells-render/btn-edit-renderer.component';

@Component({
  selector: 'app-categorias-casting',
  templateUrl: './categorias-casting.component.html',
  styleUrls: ['./categorias-casting.component.scss'],
})
export class CategoriasCastingComponent implements OnInit {
  @Input() Casting: Casting = null;

  // Forma para la captura de contactos
  formCategorias: FormGroup;

  categoriasCasting: CategoriaCasting[] = [];

  // Api para acceso a la tabla
  private gridApi!: GridApi<CategoriaCasting>;
  //aqui se almacenan las categorias
  categoriaEditar: CategoriaCasting;
  //bandras
  listaModificada: boolean;
  editar: boolean = false;

  constructor(
    private clientApi: CastingClient,
    private formBuilder: FormBuilder
  ) {
    this.formCategorias = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
  }
  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    this.RefrescaCasting();
  }

  //Se verifica que exista Casting y categorias.
  public RefrescaCasting() {
    if (this.Casting != null) {
      if (this.Casting?.categorias != null) {
        this.gridApi.setRowData(this.Casting.categorias);
        if (this.Casting.categorias) {
          this.categoriasCasting = [...this.Casting.categorias];
        }
      }
    }
  }

  //Se añaden las categorias
  public agregarCategoria() {
    const categoria: CategoriaCasting = {
      id: uuid(),
      nombre: this.formCategorias.value.nombre,
      descripcion: this.formCategorias.value.descripcion,
    };
    this.categoriasCasting.push(categoria);
    this.limpiar();
    this.gridApi.setRowData(this.categoriasCasting);
    this.listaModificada = true;
  }
  //limpia el form
  public limpiar() {
    this.formCategorias.get('nombre').setValue('');
    this.formCategorias.get('descripcion').setValue('');
  }

  //
  public eliminaCategoria(seleccionado: string) {
    var index = this.categoriasCasting.findIndex(
      (element) => element.id == seleccionado
    );
    console.log(index);
    if (index > -1) {
      this.categoriasCasting.splice(index, 1);
      this.gridApi.setRowData(this.categoriasCasting);
    }
    this.listaModificada = true;
  }

  onGridReady(params: GridReadyEvent<CategoriaCasting>) {
    this.gridApi = params.api;
  }

  //configuracion para columnas
  public defaultColDef: ColDef = {
    wrapHeaderText: true,
    autoHeaderHeight: true,
    sortable: true,
    filter: true,
  };

  public rowSelection: 'single' | 'multiple' = 'single';

  //definicion de cololumnas de tablas
  columnDefs: ColDef[] = [
    {
      headerName: '',
      field: 'id',
      width: 5,
      cellRenderer: BtnCloseRenderer,
      cellRendererParams: {
        clicked: (field: any) => {
          this.eliminaCategoria(field);
        },
      },
    },
    { headerName: 'Nombre', field: 'nombre', minWidth: 220, maxWidth: 350 },
    {
      headerName: 'Descripcion',
      field: 'descripcion',
      minWidth: 600,
      flex: 1,
    },
    {
      headerName: '',
      field: 'id',
      width: 82,
      cellRenderer: BtnEditRenderer,
      cellRendererParams: {
        clicked: (field: any) => {
          this.editarCategoria(field);
        },
      },
    },
  ];
  //edita una categoria de la tabla
  public editarCategoria(id?: string) {
    this.editar = true;
    if (id == null) {
      const selectedData = this.gridApi.getSelectedRows();
      this.categoriaEditar = this.categoriasCasting.find(
        (_) => _.id == selectedData[0].id
      );
    } else {
      this.categoriaEditar = this.categoriasCasting.find((_) => _.id == id);
    }
    this.formCategorias.get('nombre').setValue(this.categoriaEditar.nombre);
    this.formCategorias
      .get('descripcion')
      .setValue(this.categoriaEditar.descripcion);
  }
  //Actualiza una categoria de la tabla
  public actualizarCategoria() {
    this.categoriasCasting.find((_) => _.id == this.categoriaEditar.id).nombre =
      this.formCategorias.value.nombre;
    this.categoriasCasting.find(
      (_) => _.id == this.categoriaEditar.id
    ).descripcion = this.formCategorias.value.descripcion;
    this.editar = false;
    this.gridApi.setRowData(this.categoriasCasting);
    this.limpiar();
  }

  public enviarCategorias(castingId: Casting) {
    if (this.listaModificada == true && castingId != null) {
      this.clientApi
        .categorias(castingId.id, this.categoriasCasting)
        .subscribe((data) => {});
      this.Casting = castingId;
      this.Casting.categorias = this.categoriasCasting;
    }
  }
}
