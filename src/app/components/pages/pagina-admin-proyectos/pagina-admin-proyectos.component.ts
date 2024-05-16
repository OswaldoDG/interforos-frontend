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
  estadoLogo: boolean = true;
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
  }

  ngAfterViewInit(): void {
    this.spinner.show('loadCastings');
    this.castingClient.castingGet(true).subscribe(
      (data) => {
        this.casting = data;
        this.castingsFiltrados = data;
        this.form.get('buscar').valueChanges.subscribe((v) => {
          this.filtrarCasting(v);
        });
        if (this.estadoLogo == false) {
          this.spinner.hide('loadCastings');
          this.estadoLogo = false;
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
    this.spinner.show('loadCastings');
    this.castingClient.castingGet(true).subscribe((data) => {
      this.casting = data;
      this.castingsFiltrados = data;
      this.spinner.hide('loadCastings');
    });
  }

  recibidoDelModal(r: string) {
    if (r == 'Y') {
      this.spinner.show('loadCastings');
      this.castingClient.castingGet(true).subscribe((data) => {
        this.casting = data;
        this.castingsFiltrados = data;
        this.spinner.hide('loadCastings');
      });
    }
  }

  logoCargadoEvnt(r: boolean) {
    this.estadoLogo = r;
  }

  filtrarCasting(buscar: string) {
    if (buscar) {
      this.castingsFiltrados = this.casting.filter((c) =>
        c.nombre.toLocaleLowerCase().includes(buscar.toLocaleLowerCase())
      );
    } else {
      this.castingsFiltrados = this.casting;
    }
  }
}
