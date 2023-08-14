import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { CastingClient, Persona } from 'src/app/services/api/api-promodel';
import { environment } from 'src/environments/environment';

import { PersonaInfoService } from 'src/app/services/persona/persona-info.service';
import { CastingStaffServiceService } from 'src/app/services/casting-staff-service.service';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-persona-card',
  templateUrl: './persona-card.component.html',
  styleUrls: ['./persona-card.component.scss'],
})
export class PersonaCardComponent implements OnInit {
  @Input() persona: Persona = null;

  mobile: boolean = false;
  avatarUrl: string = 'assets/img/avatar-404.png';
  imagenes = [];
  tabHome = '';
  tabHomeBtn = '';

  configCarousel = {
    height: '250px',
    space: 1,
  };
  enCasting: boolean = false;
  T: any;
  enCategoria: boolean;
  constructor(
    private bks: BreakpointObserver,
    private personaService: PersonaInfoService,
    private servicio: CastingStaffServiceService,
    private castingService: CastingClient,
    private toastService: HotToastService,
    private translate: TranslateService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.persona != null) {
      if (this.persona?.elementoMedioPrincipalId) {
        this.avatarUrl = `${environment.apiRoot}/contenido/${this.persona.usuarioId}/${this.persona.elementoMedioPrincipalId}/thumb`;
      }
      this.personaService
        .obtieneMediosPErsona(this.persona.usuarioId)
        .subscribe((m) => {
          m.elementos.forEach((e) => {
            if (e.imagen) {
              this.imagenes.push({
                image: `${environment.apiRoot}/contenido/${m.usuarioId}/${e.id}/full`,
                thumbImage: `${environment.apiRoot}/contenido/${m.usuarioId}/${e.id}/card`,
              });
            } else {
              if (e.video) {
                this.imagenes.push({
                  video: `${environment.apiRoot}/videos/${m.usuarioId}/${e.id}-full.mp4`,
                  posterImage: `${environment.apiRoot}/contenido/${m.usuarioId}/${e.frameVideoId}/card`,
                });
              }
            }
          });
        });
      this.validarExiste();
    }
  }

  ngOnInit(): void {
    this.bks
      .observe(['(min-width: 500px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.mobile = false;
        } else {
          this.mobile = true;
        }
      });

    this.servicio.CategoriaSub().subscribe((e) => {
      this.validarExiste();
    });
    this.translate.get(['buscar.categorias-error']).subscribe((ts) => {
      this.T = ts;
    });
  }
  validarExiste() {
    this.enCasting =
      this.servicio
        .CastingsPersona(this.persona.id)
        .indexOf(this.servicio.CategoriActual()) >= 0;
    if (this.servicio.personaEnCategoria(this.persona.id) >= 0) {
      this.enCategoria = true;
    } else {
      this.enCategoria = false;
    }
  }
  onChangeCheckBox(id: string) {
    if (this.servicio.CastingIdActual() && this.servicio.CategoriActual()) {
      if (this.enCasting) {
        this.castingService
          .modeloPut(
            this.servicio.CastingIdActual(),
            id,
            this.servicio.CategoriActual()
          )
          .subscribe((d) => {
            this.servicio.agregarModelo(id, this.servicio.CategoriActual());
            this.enCategoria = !this.enCategoria;
          });
      } else {
        this.castingService
          .modeloDelete(
            this.servicio.CastingIdActual(),
            id,
            this.servicio.CategoriActual()
          )
          .subscribe((d) => {
            this.servicio.removerModelo(id, this.servicio.CategoriActual());
            this.enCategoria = !this.enCategoria;
          });
      }
    } else {
      this.validarExiste();
      this.toastService.warning(this.T['buscar.categorias-error'], {
        position: 'bottom-center',
      });
    }
  }
}
