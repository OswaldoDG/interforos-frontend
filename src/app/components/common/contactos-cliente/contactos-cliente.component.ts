import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Casting, CastingClient, ClientesClient, Contacto, ContactoCasting, ContactoUsuario, TipoRolCliente } from 'src/app/services/api/api-promodel';
import {
  CellRendererSelectorResult,
  ColDef,
  GridApi,
  GridReadyEvent,
  RowSelectedEvent,
  SortDirection,
  ValueParserParams,
} from 'ag-grid-community';
import { FormGroup, Validators,FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { isEmpty } from '@datorama/akita';

@Component({
  selector: 'app-contactos-cliente',
  templateUrl: './contactos-cliente.component.html',
  styleUrls: ['./contactos-cliente.component.scss']
})
export class ContactosClienteComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() Casting : Casting = null;


  // Especifica si hay un contacto seleccionado del typeahead
  protected listaModificada: boolean =  false;
  // Es esta variable se guardan todos los contactos del cliente, en el typeahead se filtran por email
  protected contactosCliente: any[] = [];

  // En esta variabl se llenan los contactos seleccionados
  protected contactosCasting: ContactoUsuario[] = [];

  roles : TipoRolCliente[] =[TipoRolCliente.Staff, TipoRolCliente.RevisorExterno];
  selected?: string;
  noResult = false;
  formContactos : FormGroup;
  private gridApi!: GridApi<ContactoCasting>;
  public rowData: ContactoUsuario[] | null = this.contactosCasting ;

  public rowSelection: 'single' | 'multiple' = 'single';
  typeaheadNoResults(event: boolean): void {
    this.noResult = event;
  }

  columnDefs: ColDef[] = [
    {       headerName: 'Email',
    field: 'email',       minWidth: 50,maxWidth:333},
    {       headerName: 'Rol',
    field: 'rol',       flex:1,},
    {       headerName: 'Activo',
    field: 'confirmado',
    cellRenderer: 'agCheckboxCellRenderer',
      cellRendererParams: {
        disabled: true,
      },      flex:2,
    },
  ];

  constructor(private clientApi: CastingClient,
              private clientesClient: ClientesClient,
              private formBuilder: FormBuilder,
              private ruta : Router) {

                this.formContactos = this.formBuilder.group({
                  email: ['', Validators.required],
                  rol: ['', Validators.required],
                });
              }

  ngAfterViewInit(): void {
    // leer aqui los contactos del cliente con clientApi
    // almacenarlos en this.contactosCliente
    // y utlizarlos para el typeahead

    this.clientesClient.contactos().subscribe((data) => {
      this.contactosCliente = data;
    });
  }
  public defaultColDef: ColDef = {
    resizable: true,
    initialWidth: 200,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    sortable: true,
    filter: true,
    minWidth: 100,
  };
  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
      this.RefrescaCasting();
    }

  //Se verifica que exista Casting, y contactos.
  private RefrescaCasting() {
    if(this.Casting != null){
      if(this.Casting?.contactos != null){
        if(this.Casting?.contactos.length > 0){
          this.gridApi.setRowData(this.Casting.contactos);
          this.contactosCasting = this.Casting.contactos;
        }
      }
    }
  }

  public invitar(){
    this.noResult=false;
    this.listaModificada = true;
    var existe = this.contactosCasting.find(element =>
        element.email == this.formContactos.value.email);
    if(existe != null){
      this.gridApi.setRowData(this.contactosCasting);
    }else{
      if(this.formContactos.value.email != null && this.formContactos.value.rol != null){
        const contactoUser : ContactoUsuario = {
          id : null,
          email : this.formContactos.value.email,
          nombreCompleto : null,
          rol : this.formContactos.value.rol,
          localizado : false,
        }
        this.contactosCasting.push(contactoUser);
        this.gridApi.setRowData(this.contactosCasting);
        this.formContactos
        .get('email')
        .setValue('');
        this.formContactos
        .get('rol')
        .setValue('');
      }
    }
  }

  public eliminar(){
    const selectedData = this.gridApi.getSelectedRows();
    this.selected = selectedData[0].email;
    this.cambios(this.selected);
    this.formContactos
    .get('email')
    .setValue('');
    this.formContactos
    .get('rol')
    .setValue('');
  }

  public editar(){
    const selectedData = this.gridApi.getSelectedRows();
    this.selected = selectedData[0].email;
    this.cambios(this.selected);
    this.formContactos
    .get('email')
    .setValue(this.selected);
    this.formContactos
    .get('rol')
    .setValue('');
  }

  public cambios(seleccionado : string){
    var index = this.contactosCasting.findIndex(element => element.email == seleccionado);
    if(index > -1){
      this.contactosCasting.splice(index,1);
      this.gridApi.setRowData(this.contactosCasting);
    }
  }

  // REaliza una actualización de los contactos al backend utilizando la proiedad casting y la lista de contactosCliente
  public actualizaContactos(idCasting : string) {
    if(this.listaModificada == true){
      this.clientApi.contactos(idCasting, this.contactosCasting).subscribe((data)=>{
        this.rowData = data.contactos;
        this.ruta.navigateByUrl('proyectos/casting/' + data.id);
      });
      this.gridApi.setRowData(this.rowData);
    }
  }

  onGridReady(params: GridReadyEvent<ContactoCasting>) {
    this.gridApi = params.api;
  }
}
