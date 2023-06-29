import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Persona } from 'src/app/services/api/api-promodel';
import { environment } from 'src/environments/environment';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { PersonaInfoService } from 'src/app/services/persona/persona-info.service';

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

  constructor(
    private bks: BreakpointObserver,
    private personaService: PersonaInfoService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.persona != null) {
      if (this.persona?.elementoMedioPrincipalId) {
        this.avatarUrl = `${environment.apiRoot}/contenido/${this.persona.usuarioId}/${this.persona.elementoMedioPrincipalId}/thumb`;
      }
      console.log(this.persona.usuarioId);
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
          console.log(m);
        });
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
  }
}
