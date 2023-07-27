import { formatDate } from '@angular/common';
import { Component, Inject, Input, LOCALE_ID, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { Casting, CastingClient, EventoCasting } from 'src/app/services/api/api-promodel';


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
  protected listaEventos : EventoCasting[] = [];

  //Bandera que indica si se ha modificado la lista
  protected listaModificada : boolean = false;

  //Api de Ag Grid
  private gridApi!: GridApi<EventoCasting>;

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
    this.dateTimeAdapter.setLocale('es-MX');
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
    let existeEnListaEventos = this.listaEventos.find(e=> e.id == this.idEventoSeleccionado());
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
         }
    }
    this.limpiarFormEventos();
    this.gridApi.setRowData(this.listaEventos);
    this.listaModificada = true;
  }


  //Realiza una actualización de los eventos al backend utilizando el parámetro castingId y la lista de Eventos
  public actualizarEventos(castingId : Casting){
    if(this.listaModificada == true && castingId != null){
      this.clientApi.eventos(castingId.id, this.listaEventos).subscribe((data)=>{

      });
      this.Casting = castingId;
      this.Casting.eventos = this.listaEventos;
    }
  }

  //Muesta los datos del evento seleccionaod en la tabla en el formulario de eventos
  public mostrarEventoSeleccionado(){
    if(this.idEventoSeleccionado() != null){
      let evento = this.listaEventos.find(e => e.id == this.idEventoSeleccionado());
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
  public eliminaEventoSeleccionado(){
    this.listaModificada = true;
    var index = this.listaEventos.findIndex(element => element.id == this.idEventoSeleccionado());
    if(index > -1){
      this.listaEventos.splice(index,1);
      this.gridApi.setRowData(this.listaEventos);
    }
  }

  //Se obtiene el id del evento seleccionado de la tabla
  public idEventoSeleccionado(): number {
    const selectedData = this.gridApi.getSelectedRows();
    if(selectedData.length > 0) {
      return selectedData[0].id;
    }
    return null;
  }


  onGridReady(params: GridReadyEvent<EventoCasting>) {
    this.gridApi = params.api;
  }


  //AUXILIARES
  public defaultColDef: ColDef = {
    resizable: true,
    initialWidth: 500,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    sortable: true,
    filter: false,
    minWidth: 90,
  };

  public rowSelection: 'single' | 'multiple' = 'single';

  columnDefs: ColDef[] = [
    {
      headerName: 'No. Evento',
      field: 'id',
      minWidth:90,
      maxWidth: 150,
      editable: false,
      sortable: true,
      resizable: true,
    },
    {
      headerName: 'Fecha Inicial',
      field: 'fechaInicial',
      minWidth:90,
      maxWidth: 150,
      cellRenderer: (data) => {
        return formatDate(data.value, 'dd-MM-YYYY', this.locale);
      },
      editable: false,
      sortable: true,
      resizable: true,
    },
    {       headerName: 'Fecha Final',
    field: 'fechaFinal',minWidth:90, maxWidth: 150,
    cellRenderer: (data) => {
      return formatDate(data.value, 'dd-MM-YYYY', this.locale);
    },},
    {
      headerName: 'Notas',
      field: 'notas',
      minWidth:90,
      maxWidth: 150,
      editable: false,
      sortable: true,
      resizable: true,
    },
    {
      headerName: 'Lugar',
      field: 'lugar',
      minWidth:90,
      maxWidth: 150,
      editable: false,
      sortable: true,
      resizable: true,
    },
    {
      headerName: 'Link',
      field: 'coordenadas',
      minWidth:90,
      maxWidth: 150,
      editable: false,
      sortable: true,
      resizable: true,
    },
  ];

}
