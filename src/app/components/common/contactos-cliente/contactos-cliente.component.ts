import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  Casting,
  CastingClient,
  ClientesClient,
  ContactoCasting,
  ContactoUsuario,
  TipoRolCliente,
} from 'src/app/services/api/api-promodel';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-contactos-cliente',
  templateUrl: './contactos-cliente.component.html',
  styleUrls: ['./contactos-cliente.component.scss'],
})
export class ContactosClienteComponent
  implements OnInit, AfterViewInit, OnChanges
{
  @Input() Casting: Casting = null;

  // Especifica si hay un contacto seleccionado del typeahead
  protected listaModificada: boolean = false;
  // Es esta variable se guardan todos los contactos del cliente, en el typeahead se filtran por email
  protected contactosCliente: any[] = [];
  // En esta variabl se llenan los contactos seleccionados
  protected contactosCasting: ContactoCasting[] = [];
  //  dropdown en el template
  roles: TipoRolCliente[] = [
    TipoRolCliente.Staff,
    TipoRolCliente.RevisorExterno,
  ];
  // email seleccioando en los contactos del typeahead
  selected?: string;
  // Forma para la captura de contactos
  formContactos: FormGroup;

  // Api para ccesdo a la tabla
  private gridApi!: GridApi<ContactoCasting>;

  constructor(
    private clientApi: CastingClient,
    private clientesClient: ClientesClient,
    private formBuilder: FormBuilder
  ) {
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

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    this.RefrescaCasting();
  }

  //Se verifica que exista Casting, y contactos.
  public RefrescaCasting() {
    if (this.Casting != null) {
      if (this.Casting?.contactos != null) {
        this.gridApi.setRowData(this.Casting.contactos);
        if (this.Casting.contactos) {
          this.contactosCasting = [...this.Casting.contactos];
        }
      }
    }
  }

  //Se añaden los contactos a la lista de seleccionados.
  public invitar() {
    let existeEnLista = this.contactosCasting.find(
      (c) => c.email == this.selected
    );
    let existeEnDB = this.contactosCliente.find(
      (c) => c.email == this.selected
    );
    if (existeEnLista == undefined) {
      if (existeEnDB == undefined) {
        const contacto: ContactoUsuario = {
          id: null,
          email: this.selected,
          nombreCompleto: null,
          rol: this.formContactos.value.rol,
          localizado: false,
        };
        this.contactosCasting.push(contacto);
      } else {
        this.contactosCasting.push(existeEnDB);
      }
    } else {
      if (existeEnLista.rol != this.formContactos.value.rol) {
        this.contactosCasting.forEach((c) => {
          if (c.email == existeEnLista.email) {
            c.rol = this.formContactos.value.rol;
          }
        });
      }
    }
    this.limpiar();
    this.gridApi.setRowData(this.contactosCasting);
    this.listaModificada = true;
  }

  // Realiza una actualización de los contactos al backend utilizando la proiedad casting y la lista de contactosCliente
  public actualizaContactos(castingId: string) {
    if (this.listaModificada == true && castingId != null) {
      const payload: ContactoUsuario[] = [];
      this.contactosCasting.forEach((c) => {
        if (c.usuarioId != null) {
          payload.push({
            id: c.usuarioId,
            email: c.email,
            nombreCompleto: null,
            rol: c.rol,
            localizado: c.confirmado,
          });
        } else {
          payload.push(c);
        }
      });
      this.clientApi.contactos(castingId, payload).subscribe((data) => {
        this.contactosCasting = [...data.contactos];
        this.gridApi.setRowData(this.contactosCasting);
      });
    }
  }

  public eliminar() {
    const selectedData = this.gridApi.getSelectedRows();
    this.eliminaContacto(selectedData[0].email);
    this.limpiar();
  }

  public mostrarContactoSeleccionado() {
    if (this.idContactoSeleccionado() != null) {
      let contacto = this.contactosCasting.find(
        (c) => c.email == this.idContactoSeleccionado()
      );
      if (contacto != undefined) {
        this.formContactos.get('email').setValue(contacto.email);
        this.formContactos.get('rol').setValue(contacto.rol);
      }
    }
  }

  public limpiar() {
    this.formContactos.get('email').setValue('');
    this.formContactos.get('rol').setValue('');
  }

  public eliminaContacto(seleccionado: string) {
    var index = this.contactosCasting.findIndex(
      (element) => element.email == seleccionado
    );
    if (index > -1) {
      this.contactosCasting.splice(index, 1);
      this.gridApi.setRowData(this.contactosCasting);
    }
  }

  // revisar si se utilzai esta funcion
  public idContactoSeleccionado(): string {
    const selectedData = this.gridApi.getSelectedRows();
    if (selectedData.length > 0) {
      return selectedData[0].email;
    }
    return null;
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
    // nada por ahora
  }

  columnDefs: ColDef[] = [
    { headerName: 'Email', field: 'email', minWidth: 50, maxWidth: 333 },
    { headerName: 'Rol', field: 'rol', flex: 1 },
    {
      headerName: 'Activo',
      field: 'confirmado',
      cellRenderer: 'agCheckboxCellRenderer',
      cellRendererParams: {
        disabled: true,
      },
      flex: 2,
    },
  ];
}
