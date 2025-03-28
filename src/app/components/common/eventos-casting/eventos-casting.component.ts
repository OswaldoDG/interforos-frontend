import { formatDate } from '@angular/common';
import { Component, Inject, Input, LOCALE_ID, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { Casting, CastingClient, EventoCasting } from 'src/app/services/api/api-promodel';
import { BtnCloseRenderer } from '../cells-render/btn-close-renderer.component';
import { BtnEditRenderer } from '../cells-render/btn-edit-renderer.component';
import { ModalConfirmacionComponent } from '../modal-confirmacion/modal-confirmacion.component';


@Component({
  selector: 'app-eventos-casting',
  templateUrl: './eventos-casting.component.html',
  styleUrls: ['./eventos-casting.component.scss'],
})
export class EventosCastingComponent implements OnInit {
  //Casting Actual
  @Input() Casting : Casting = null;

  //Formulario del Evento
  formEventos : FormGroup;

  //Valores iniciales para las fechas.
  fechaAperturaSingle : Date;
  fechaCierreSingle : Date;

  //Lista de Eventos
  public listaEventos : EventoCasting[] = [];

  //Bandera que indica si se ha modificado la lista
  protected listaModificada : boolean = false;

  //Api de Ag Grid
  public gridApi!: GridApi<EventoCasting>;

  //variable que almacena el evento que se va a modificar.
  protected eventoSeleccionado : any;

  //Modal
  @ViewChild( ModalConfirmacionComponent) componenteModal;

  //variable para capturar el id del contacto seleccionado a eliminar.
  protected idSeleccinadoEliminar:any;

  constructor(private formBuilder: FormBuilder,
              @Inject(LOCALE_ID) private locale: string,
              private dateTimeAdapter: DateTimeAdapter<any>,
              private clientApi: CastingClient) {
    this.formEventos = this.formBuilder.group({
      fechaHoraInicial : ['', Validators.required],
      fechaHoraFinal : ['', Validators.required],
      lugar : [null],
      notas : [null],
      link : [null]
    });
    this.dateTimeAdapter.setLocale('es-mx');
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    this.refrescarEvento();
  }

  //Se verifica que exista Casting y eventos.
  public refrescarEvento(){
    if(this.Casting != null){
      if(this.Casting?.eventos != null){
        this.gridApi.setRowData(this.Casting.eventos);
        if(this.Casting.eventos){
          this.listaEventos = [...this.Casting.eventos];
        }
      }
    }
  }

  //Se añaden los eventos a listaEventos (la lista que se va enviar a la api).
  public agregarEvento(){
    let existeEnListaEventos = this.listaEventos.find(e=> e.id == this.eventoSeleccionado);
    if(existeEnListaEventos == undefined){
      this.listaEventos.push({
        id : this.generaId(),
        fechaInicial : this.formEventos.value.fechaHoraInicial,
        fechaFinal :this.formEventos.value.fechaHoraFinal,
        notas : this.formEventos.value.notas,
        lugar : this.formEventos.value.lugar,
        coordenadas : this.formEventos.value.link
      })
    }else{
      if(existeEnListaEventos.fechaInicial != this.formEventos.value.fechaHoraInicial ||
         existeEnListaEventos.fechaFinal != this.formEventos.value.fechaHoraFinal ||
         existeEnListaEventos.lugar != this.formEventos.value.lugar ||
         existeEnListaEventos.notas != this.formEventos.value.notas ||
         existeEnListaEventos.coordenadas != this.formEventos.value.link)
         {
          this.listaEventos.forEach(e =>{
            if(e.id == existeEnListaEventos.id){
              e.fechaInicial = this.formEventos.value.fechaHoraInicial,
              e.fechaFinal = this.formEventos.value.fechaHoraFinal,
              e.notas = this.formEventos.value.notas,
              e.lugar = this.formEventos.value.lugar,
              e.coordenadas = this.formEventos.value.link
            }
          });
          this.eventoSeleccionado = undefined;
         }
    }
    this.limpiarFormEventos();
    this.gridApi.setRowData(this.listaEventos);
    this.listaModificada = true;
  }

  //Muesta los datos del evento seleccionaod en la tabla en el formulario de eventos
  public mostrarEventoSeleccionado(field : any){
    if(field!= null){
      this.eventoSeleccionado = field;
      let evento = this.listaEventos.find(e => e.id == field);
      if(evento != undefined){
        this.formEventos
        .get('fechaHoraInicial')
        .setValue(evento.fechaInicial);
        this.formEventos
        .get('fechaHoraFinal')
        .setValue(evento.fechaFinal);
        this.formEventos
        .get('lugar')
        .setValue(evento.lugar);
        this.formEventos
        .get('notas')
        .setValue(evento.notas);
        this.formEventos
        .get('link')
        .setValue(evento.coordenadas);
      }
    }
  }

  /**
   * Genera el Id, validando que no se repita en la lista de eventos.
   * @returns numeroAletario
   */
  public generaId() : number{
    let numeroAleatorio: number;
    do{
      numeroAleatorio = Math.floor(Math.random() * 100) + 1;
    }while(this.listaEventos.find(e=> e.id == numeroAleatorio) != undefined);
    return numeroAleatorio;
  }

  //Vacía el formulario cada que se hace una adición a la listaEventos
  public limpiarFormEventos(){
    this.formEventos
    .get('fechaHoraInicial')
    .setValue('');
    this.formEventos
    .get('fechaHoraFinal')
    .setValue('');
    this.formEventos
    .get('lugar')
    .setValue('');
    this.formEventos
    .get('notas')
    .setValue('');
    this.formEventos
    .get('link')
    .setValue('');
  }

  //Elimina el evento seleccionado de la tabla
  public eliminaEventoSeleccionado(field : any){
    var index = this.listaEventos.findIndex(element => element.id == field);
    if(index > -1){
      this.listaEventos.splice(index,1);
      this.gridApi.setRowData(this.listaEventos);
    }
    this.listaModificada = true;
  }

  onGridReady(params: GridReadyEvent<EventoCasting>) {
    this.gridApi = params.api;
  }

  recibidoDelModal(r : string){
    if(r == 'Y'){
      this.eliminaEventoSeleccionado(this.idSeleccinadoEliminar);
    }
    this.idSeleccinadoEliminar = '';
  }


  //AUXILIARES
  public defaultColDef: ColDef = {
    wrapHeaderText: false,
    autoHeaderHeight: false,
    sortable: false,
    suppressMovable:true,
    resizable:false,
    };

  public rowSelection: 'single' | 'multiple' = 'single';

  columnDefs: ColDef[] = [
    {

      headerName: '',
      field: 'id',
      minWidth:10,
      maxWidth: 40,

      cellRenderer: BtnCloseRenderer,
      cellRendererParams:{
        clicked: (field : any) => {
          this.componenteModal.openModal(this.componenteModal.myTemplate, 'eliminar el evento');
          this.idSeleccinadoEliminar = field;
        },
      },

    },
    {
      headerName: 'Fecha Inicial',
      field: 'fechaInicial',
      minWidth:150,
          cellRenderer: (data) => {
        return formatDate(data.value, 'dd-MM-YYYY: hh:mm', this.locale);
      },

    },
    {       headerName: 'Fecha Final',
    field: 'fechaFinal',minWidth:150, maxWidth: 190,
    cellRenderer: (data) => {
      return formatDate(data.value, 'dd-MM-YYYY : hh:mm', this.locale);
    },},
    {
      headerName: 'Notas',
      field: 'notas',
      minWidth:290,


    },
    {
      headerName: 'Lugar',
      field: 'lugar',
      minWidth:200,


    },
    {
      headerName: 'Link',
      field: 'coordenadas',
      minWidth:200,

    },
    {
      headerName: '',
      field: 'id',
      width:75,
      cellRenderer: BtnEditRenderer,
      cellRendererParams:{
        clicked: (field: any) => {
          this.mostrarEventoSeleccionado(field);
        },
      },
    },
  ];

}
