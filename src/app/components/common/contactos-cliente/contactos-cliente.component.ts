import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
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
import { BtnCloseRenderer } from '../cells-render/btn-close-renderer.component';
import { BtnEditRenderer } from '../cells-render/btn-edit-renderer.component';
import { ModalConfirmacionComponent } from '../modal-confirmacion/modal-confirmacion.component';

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
  // En esta variable se llenan los contactos seleccionados
  public contactosCasting: ContactoCasting[] = [];
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
  public gridApi!: GridApi<ContactoCasting>;

  //Modal
  @ViewChild(ModalConfirmacionComponent) componenteModal;

  //variable para capturar el id del contacto seleccionado de la tabla a eliminar.
  protected idSeleccinadoEliminar: any;

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

  //Retonar la lista de contactos convertida a contactos usuarios.
  public listaContactoUsuario() {
    const payload: ContactoUsuario[] = [];
    this.contactosCasting.forEach((c) => {
      if (c.usuarioId != null) {
        payload.push({
          id: c.usuarioId,
          email: c.email,
          nombreUsuario: c.nombreUsuario,
          rol: c.rol,
          localizado: c.confirmado,
        });
      } else {
        payload.push(c);
      }
    });

    return payload;
  }

  //Se añaden los contactos a la lista de seleccionados.
  public invitar() {
    console.log('ENTRÍ');
    let existeEnLista = this.contactosCasting.find(
      (c) => c.email == this.selected
    );
    let existeEnDB: ContactoCasting = this.contactosCliente.find(
      (c) => c.email == this.selected
    );
    if (existeEnLista == undefined) {
      console.log('Entró aquí');
      if (existeEnDB == undefined) {
        console.log('Entró aquí');
        const contacto: ContactoUsuario = {
          id: null,
          email: this.selected,
          nombreUsuario: this.selected,
          rol: this.formContactos.value.rol,
          localizado: false,
        };
        this.contactosCasting.push(contacto);
        console.log(this.contactosCasting);
      } else {
        existeEnDB.rol = this.formContactos.value.rol;
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

  public mostrarContactoSeleccionado(field: any) {
    if (field != null) {
      let contacto = this.contactosCasting.find((c) => c.email == field);
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

  public eliminaContacto(field: any) {
    var index = this.contactosCasting.findIndex(
      (element) => element.email == field
    );
    if (index > -1) {
      this.contactosCasting.splice(index, 1);
      this.gridApi.setRowData(this.contactosCasting);
    }
    this.listaModificada = true;
  }

  onGridReady(params: GridReadyEvent<ContactoCasting>) {
    this.gridApi = params.api;
  }

  // Auxiliares UI
  recibidoDelModal(r: string) {
    if (r == 'Y') {
      this.eliminaContacto(this.idSeleccinadoEliminar);
    }
    this.idSeleccinadoEliminar = '';
  }

  public defaultColDef: ColDef = {
    resizable: false,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    sortable: false,
    filter: false,
  };

  public rowSelection: 'single' | 'multiple' = 'single';

  typeaheadNoResults(event: boolean): void {
    // nada por ahora
  }

  columnDefs: ColDef[] = [
    {
      headerName: '',
      field: 'email',
      width: 10,
      cellRenderer: BtnCloseRenderer,
      cellRendererParams: {
        clicked: (field: any) => {
          this.componenteModal.openModal(
            this.componenteModal.myTemplate,
            'el contacto'
          );
          this.idSeleccinadoEliminar = field;
        },
      },
    },
    {
      headerName: 'Usuario',
      field: 'nombreUsuario',
      minWidth: 150,
    },
    {
      headerName: 'Email',
      field: 'email',
      minWidth: 260,
    },
    {
      headerName: 'Rol',
      field: 'rol',
      minWidth: 90,
    },
    {
      headerName: 'Activo',
      width: 90,
      field: 'confirmado',
      cellRenderer: 'agCheckboxCellRenderer',
      cellRendererParams: {
        disabled: true,
      },
    },
    {
      headerName: '',
      field: 'email',
      width: 90,
      cellRenderer: BtnEditRenderer,
      cellRendererParams: {
        clicked: (field: any) => {
          this.mostrarContactoSeleccionado(field);
        },
      },
    },
  ];
}
