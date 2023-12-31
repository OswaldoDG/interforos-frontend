import { PersistState } from '@datorama/akita';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { first, takeUntil } from 'rxjs/operators';
import {
  AccesoClient,
  BusquedaPersonasRequestPaginado,
  ClienteView,
  PersonaClient,
  PersonaResponsePaginado,
  RegistroClient,
  SelectorCastingCategoria,
  TipoRolCliente,
} from 'src/app/services/api/api-promodel';
import { SessionQuery } from 'src/app/state/session.query';
import { SessionService } from 'src/app/state/session.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Title } from '@angular/platform-browser';
import { ClienteViewVacio } from 'src/app/modelos/entidades-vacias';
import { CastingStaffServiceService } from 'src/app/services/casting-staff-service.service';
import { BusquedaPersonasService } from 'src/app/services/busqueda-personas.service';

@Component({
  selector: 'app-promodel-staff',
  templateUrl: './promodel-staff.component.html',
  styleUrls: ['./promodel-staff.component.scss'],
  providers: [CastingStaffServiceService,BusquedaPersonasService],
})
export class PromodelStaffComponent implements OnInit {
  T: any[];
  casting: SelectorCastingCategoria;

  EstadoBusqueda(buscando: boolean) {
    if (buscando) {
      this.spinner.show('buscar');
    } else {
      this.spinner.hide('buscar');
    }
  }

  pageTitleContent = [
    {
      title: 'modelo.t-modelo',
      backgroundImage: 'assets/img/page-title/title-gen-bg.jpg',
    },
  ];

  constructor(
    @Inject('persistStorage') private persistStorage: PersistState[],
    private bks: BreakpointObserver,
    private translate: TranslateService,
    private toastService: HotToastService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.translate.get(['staff-search.titulo']).subscribe((trads) => {
      this.T = trads;
    });
  }
}
