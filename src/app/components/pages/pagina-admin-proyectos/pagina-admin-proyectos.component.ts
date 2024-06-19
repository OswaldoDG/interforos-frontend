import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';
import {
  CastingClient,
  CastingListElement,
  TipoRolCliente,
} from 'src/app/services/api/api-promodel';
import { BodyScrollEndEvent, GridApi } from 'ag-grid-community';
import { Router } from '@angular/router';
import { SessionQuery } from 'src/app/state/session.query';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-pagina-admin-proyectos',
  templateUrl: './pagina-admin-proyectos.component.html',
  styleUrls: ['./pagina-admin-proyectos.component.scss'],
})
export class PaginaAdminProyectosComponent implements OnInit {
  bsModalRef: BsModalRef;
  idSeleccionado: string = '';
  casting: CastingListElement[] = [];
  castingsFiltrados: CastingListElement[] = [];
  T: any;
  valoresdisponibles: number;
  v: string = 'x';
  staff: boolean = false;
  admin: boolean = false;
  form: FormGroup;
  estadoLogo: boolean = false;
  inactivos: boolean = false;
  constructor(
    private castingClient: CastingClient,
    private ruta: Router,
    private translate: TranslateService,
    private session: SessionQuery,
    private spinner: NgxSpinnerService
  ) {}
  ngOnInit(): void {
    this.form = new FormGroup({
      buscar: new FormControl(),
    });
    var roles: string[] = this.session.GetRoles;
    this.staff = roles.indexOf(TipoRolCliente.Staff.toLocaleLowerCase()) >= 0;
    this.admin =
      roles.indexOf(TipoRolCliente.Administrador.toLocaleLowerCase()) >= 0;
    this.translate
      .get(['proyectos.casting-estado-ok', 'proyectos.casting-estado-error'])
      .subscribe((ts) => {
        this.T = ts;
      });
    this.form.get('buscar').valueChanges.subscribe((v) => {
      this.filtrarCasting(v);
    });
  }

  ngAfterViewInit(): void {
    this.traerCasting();
  }

  traerCasting() {
    this.spinner.show('loadCastings');
    this.castingClient.castingGet(this.inactivos).subscribe(
      (data) => {
        if (data.length > 0) {
          this.casting = this.ordenar(data, 'asc');
          this.castingsFiltrados = this.casting;
        } else {
          this.casting = [];
          this.castingsFiltrados = this.casting;
          this.spinner.hide('loadCastings');
        }
      },
      (err) => {
        this.spinner.hide('loadCastings');
      }
    );
  }
  creaProyecto() {
    this.ruta.navigateByUrl('castings/');
  }

  refrescar() {
    this.traerCasting();
  }

  recibidoDelModal(r: string) {
    if (r == 'Y') {
      this.refrescar();
    }
  }

  logoEvnt(r: boolean) {
    this.spinner.hide('loadCastings');
  }

  filtrarCasting(buscar: string) {
    if (buscar) {
      this.castingsFiltrados = this.ordenar(
        this.casting.filter(
          (c) =>
            c.nombre.toLocaleLowerCase().includes(buscar.toLocaleLowerCase()),
          'asc'
        )
      );
    } else {
      this.castingsFiltrados = this.casting;
    }
  }

  ordenar(
    list: CastingListElement[],
    direction: string = 'asc'
  ): CastingListElement[] {
    const isAsc = direction === 'asc';
    return list.sort((a, b) => {
      const dateA = new Date(a.fechaCierre).getTime();
      const dateB = new Date(b.fechaCierre).getTime();

      if (dateA < dateB) {
        return isAsc ? -1 : 1;
      } else if (dateA > dateB) {
        return isAsc ? 1 : -1;
      } else {
        return 0;
      }
    });
  }
  onChangeInactivos() {
    this.form.get('buscar').setValue('');
    this.refrescar();
  }
}
