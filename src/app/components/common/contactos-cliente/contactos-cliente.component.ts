import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Casting, CastingClient, ClientesClient, Contacto, ContactoCasting, ContactoUsuario, TipoRolCliente } from 'src/app/services/api/api-promodel';
import {
  ColDef,
  GridApi,
  GridReadyEvent,

} from 'ag-grid-community';
import { FormGroup, Validators,FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contactos-cliente',
  templateUrl: './contactos-cliente.component.html',
  styleUrls: ['./contactos-cliente.component.scss']
})
export class ContactosClienteComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() Casting : Casting = null;


  // Especifica si hay un contacto seleccionado del typeahead
  protected listaModificada: boolean =  false;
  protected datosExistentes: boolean = false;
  // Es esta variable se guardan todos los contactos del cliente, en el typeahead se filtran por email
  protected contactosCliente: any[] = [];
  // En esta variabl se llenan los contactos seleccionados
  protected contactosCasting: ContactoCasting[] = [];

  roles : TipoRolCliente[] =[TipoRolCliente.Staff, TipoRolCliente.RevisorExterno];
  selected?: string;
  noResult = false;
  formContactos : FormGroup;
  private gridApi!: GridApi<ContactoCasting>;
  public rowData: ContactoUsuario[] | null = this.contactosCasting ;


  constructor(private clientApi: CastingClient,
              private clientesClient: ClientesClient,
              private formBuilder: FormBuilder) {

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


  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
      this.RefrescaCasting();
  }

  //Se verifica que exista Casting, y contactos.
  public RefrescaCasting() {
    if (this.Casting != null){
      if (this.Casting?.contactos != null) {
           this.gridApi.setRowData(this.Casting.contactos);
           if (this.Casting.contactos) {
            this.contactosCasting = [...this.Casting.contactos];
           }
      }
    }
  }

  //Se añaden los contactos a la lista de seleccionados.
  public invitar(){
    this.noResult=false;
    let existeEnLista = this.contactosCasting.find(c => c.email == this.selected);
    let existeEnDB = this.contactosCliente.find(c => c.email == this.selected);
    if (existeEnLista == undefined) {
        if(existeEnDB == undefined) {
          const contacto: ContactoUsuario = {
            id: null,
            email: this.selected,
            nombreCompleto: null,
            rol: this.formContactos.value.rol,
            localizado: false
          }
          this.contactosCasting.push(contacto);
        } else {
          this.contactosCasting.push(existeEnDB);
        }
    }
    this.limpiar();
    this.gridApi.setRowData(this.contactosCasting);
    this.listaModificada = true;
  }

// REaliza una actualización de los contactos al backend utilizando la proiedad casting y la lista de contactosCliente
public actualizaContactos(castingId : string) {
  if(this.listaModificada == true && castingId != null){
    const payload: ContactoUsuario[] = [];
    this.contactosCasting.forEach(c => {
      if(c.usuarioId != null){
        payload.push( {
          id: c.usuarioId,
          email: c.email,
          nombreCompleto: null,
          rol: c.rol,
          localizado: c.confirmado
         })
      }else{
        payload.push(c);
      }
    });
    this.clientApi.contactos(castingId, payload).subscribe((data)=>{
      this.contactosCasting = [...data.contactos];
      this.gridApi.setRowData(this.contactosCasting);

    });
  }
}


  public eliminar(){
    const selectedData = this.gridApi.getSelectedRows();
    this.selected = selectedData[0].email;
    this.cambios(this.selected);
    this.limpiar();
  }

  public editar(){
    this.cambios(this.seleccionarContacto());
    this.formContactos
    .get('email')
    .setValue(this.selected);
    this.formContactos
    .get('rol')
    .setValue('');
  }


  public limpiar(){
    this.formContactos
    .get('email')
    .setValue('');
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

  public seleccionarContacto(){
    const selectedData = this.gridApi.getSelectedRows();
    return this.selected = selectedData[0].email;
  }



  onGridReady(params: GridReadyEvent<ContactoCasting>) {
    this.gridApi = params.api;
  }

  // Auxiliares UI

  public defaultColDef: ColDef = {
    resizable: true,
    initialWidth: 200,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    sortable: true,
    filter: true,
    minWidth: 100,
  };

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


}
