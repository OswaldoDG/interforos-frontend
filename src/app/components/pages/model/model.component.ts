import { Component, OnDestroy, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Persona } from 'src/app/services/api/api-promodel';
import { PersonaInfoService } from 'src/app/services/persona/persona-info.service';
import { SessionQuery } from 'src/app/state/session.query';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss'],
})
export class ModelComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  private usuarioId: string = '';
  inCall: boolean = true;
  perfilOk: boolean = false;
  persona: Persona = null;

  constructor(
    private personaService: PersonaInfoService,
    private spinner: NgxSpinnerService,
    private translate: TranslateService,
    private toastService: HotToastService,
    private session: SessionQuery
  ) {}

  ngOnInit(): void {
    this.spinner.show('persona');
    this.personaService.obtieneCatalogoCliente().subscribe((p) => {
      this.session.perfil$.pipe(takeUntil(this.destroy$)).subscribe((p) => {
        if (p != null) {
          this.usuarioId = p.usuarioId;
          if (this.usuarioId) {
            this.personaService
              .ontienePersonaPorUsuarioId(this.usuarioId)
              .subscribe(
                (p) => {
                  this.resultadoPerfil(
                    true,
                    this.personaService.PersonaDesplegable(p)
                  );
                },
                (err) => {
                  console.error(err);
                  this.resultadoPerfil(false);
                }
              );
          }
        }
      });
    });
  }

  resultadoPerfil(ok: boolean, p: Persona = null) {
    this.inCall = false;
    this.perfilOk = ok;
    if (p != null) {
      this.persona = p;
    }
    this.spinner.hide('persona');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  pageTitleContent = [
    {
      title: 'modelo.t-modelo',
      backgroundImage: 'assets/img/page-title/page-title2-d.jpg',
    },
  ];
}
