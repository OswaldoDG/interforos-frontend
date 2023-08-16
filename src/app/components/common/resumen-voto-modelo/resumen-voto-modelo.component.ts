import { Component, Input, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { SelectorCategoria, VotoModeloMapeo } from 'src/app/services/api/api-promodel';
import { CastingStaffServiceService, MapeoVoto } from 'src/app/services/casting-staff-service.service';




@Component({
  selector: 'app-resumen-voto-modelo',
  templateUrl: './resumen-voto-modelo.component.html',
  styleUrls: ['./resumen-voto-modelo.component.scss']
})

export class ResumenVotoModeloComponent implements OnInit {
  @Input() personaId : string = null;


  //Variable donde se van a almacenar los votos traidos desde el servicio
  public votoMap : VotoModeloMapeo[] = [];
  //Variable donde se mapean el nivel de like y el usaurio que realizó la votación
  mapeoVotos: MapeoVoto[] = [];
  //Api ag grid
  public gridApi!: GridApi<MapeoVoto>;

  constructor(private servicio : CastingStaffServiceService) { }

  ngOnInit(): void {
    this.actualizarTabla();
    this.servicio.CategoriaSub().subscribe((v) => {
      if(v){
        this.actualizarTabla();
      }
    });
  }

  actualizarTabla() {
    this.mapeoVotos = [];
    this.votoMap = this.servicio.traerVotosModelo(this.personaId);
    const totales = {
        No: 0,
        Nose: 0,
        Si: 0,
        Mucho: 0
    };

    this.votoMap.forEach(voto => {
        const nivelLike = voto.nivelLike;
        const mapeoVoto: MapeoVoto = {
            usuarioId: this.servicio.nombreUsuarioId(voto.usuarioId),
            No: nivelLike === 0 ? "1" : null,
            Nose: nivelLike === 1 ? "1" : null,
            Si: nivelLike === 2 ? "1" : null,
            Mucho: nivelLike === 3 ? "1" : null
        };
        this.mapeoVotos.push(mapeoVoto);
        switch(nivelLike){
          case 0:
            totales.No++;
            break;
          case 1:
            totales.Nose++;
            break;
          case 2:
            totales.Si++;
            break;
          case 3:
            totales.Mucho++;
            break;
        }
    });
    // Agrega la fila de totales
    const totalesRow: MapeoVoto = {
        usuarioId: "Totales",
        No: totales.No.toString(),
        Nose: totales.Nose.toString(),
        Si: totales.Si.toString(),
        Mucho: totales.Mucho.toString()
    };
    this.mapeoVotos.push(totalesRow);
    // Actualiza los datos en la tabla
    if(this.mapeoVotos != null && this.gridApi){
      this.gridApi.setRowData(this.mapeoVotos);
    }
  }

  onGridReady(params: GridReadyEvent<MapeoVoto>){
    this.gridApi = params.api;
  }

  public defaultColDef: ColDef = {
    wrapHeaderText: false,
    autoHeaderHeight: false,
    sortable: false,
    filter: false,
    suppressMovable:true,
    resizable:false,
  };

  public rowSelection: 'single' | 'multiple' = 'single';

  columnDefs: ColDef[] = [
    { headerName: 'Revisor', field: 'usuarioId', width: 80},
    { headerName: 'No', field: 'No', width: 50 },
    { headerName: 'No sé', field: 'Nose', width: 65 },
    { headerName: 'Si', field: 'Si', width: 45 },
    { headerName: 'Mucho', field: 'Mucho', width: 69},
  ];
}
