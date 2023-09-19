import { PersistState } from '@datorama/akita';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';

import { SelectorCastingCategoria } from 'src/app/services/api/api-promodel';

import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-promodel-revisor',
  templateUrl: './promodel-revisor.component.html',
  styleUrls: ['./promodel-revisor.component.scss'],
})
export class PromodelRevisorComponent implements OnInit {
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
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    this.translate.get(['staff-search.titulo']).subscribe((trads) => {
      this.T = trads;
    });
  }
}
