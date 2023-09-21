import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { BuscarProyectoDTO } from 'src/app/modelos/locales/buscar-proyecto-dto';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import {
  CastingClient,
  CastingListElement,
  TipoRolCliente,
} from 'src/app/services/api/api-promodel';
import {GridApi,} from 'ag-grid-community';
import { Router } from '@angular/router';
import { SessionQuery } from 'src/app/state/session.query';

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
  T: any;
  valoresdisponibles:number;
  v:string='x';
staff :boolean=false;
admin :boolean=false;
  constructor(
    private castingClient: CastingClient,
    private ruta: Router, private translate: TranslateService,
    private session:SessionQuery
  ) {
  }


  ngOnInit(): void {
    var  roles: string[] = this.session.GetRoles
    this.staff=roles.indexOf(TipoRolCliente.Staff.toLocaleLowerCase())>=0;
    this.admin=roles.indexOf(TipoRolCliente.Administrador.toLocaleLowerCase())>=0;
    this.translate
    .get([
      'proyectos.casting-estado-ok',
      'proyectos.casting-estado-error'
    ]).subscribe((ts) => {
      this.T = ts;
    });


  }

  ngAfterViewInit(): void {
    this.castingClient.castingGet(true).subscribe((data) => {
      this.casting = data;
    });
  }

  creaProyecto() {
    this.ruta.navigateByUrl('castings/');
  }

  refrescar(){
    this.castingClient.castingGet(true).subscribe((data) => {
      this.casting = data;
    });
  }

  recibidoDelModal(r : string){
    if(r == 'Y'){
      this.castingClient.castingGet(true).subscribe((data) => {
        this.casting = data;
      });
    }
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
}
